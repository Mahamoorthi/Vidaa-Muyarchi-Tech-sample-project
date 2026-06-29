const express = require('express');
const session = require('express-session');
const path = require('path');
const client = require('prom-client');
const db = require('./db');
const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable prom-client default metrics collection (CPU, Memory, etc.)
client.collectDefaultMetrics();

// --------------------------------------------------------
// Prometheus Custom Metrics Registry
// --------------------------------------------------------

// HTTP requests total counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// HTTP request duration histogram
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 1.5, 2, 5]
});

// Database query duration histogram (observed in db.js)
global.dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2]
});

// Active users gauge
const activeUsersByRole = new client.Gauge({
  name: 'active_users_by_role',
  help: 'Number of active logged-in users by role',
  labelNames: ['role']
});

// Auth failures counter (observed in auth.js)
global.authFailuresCounter = new client.Counter({
  name: 'auth_failures_total',
  help: 'Total number of failed authentication and authorization attempts',
  labelNames: ['role', 'path']
});

// Middleware to track HTTP request metrics
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;
    
    // Determine route label
    const route = req.route ? req.route.path : req.path;
    
    httpRequestsTotal.labels(req.method, route, res.statusCode).inc();
    httpRequestDurationSeconds.labels(req.method, route, res.statusCode).observe(duration);
  });
  
  next();
});

// --------------------------------------------------------
// Express Middlewares
// --------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'sms-session-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Update active session metrics periodically
setInterval(async () => {
  // Reset gauge values
  activeUsersByRole.labels('Admin').set(0);
  activeUsersByRole.labels('Faculty').set(0);
  activeUsersByRole.labels('Student').set(0);

  // In a real application, sessions would be queried from a session store.
  // Here we dynamically track active mock logins and authenticated users.
  if (global.activeSessions) {
    Object.keys(global.activeSessions).forEach(role => {
      activeUsersByRole.labels(role).set(global.activeSessions[role] || 0);
    });
  }
}, 5000);

global.activeSessions = { Admin: 0, Faculty: 0, Student: 0 };

// --------------------------------------------------------
// Authentication Routes (Keycloak & Mock Login)
// --------------------------------------------------------

app.get('/login-portal', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/login', async (req, res) => {
  const oidc = await auth.getOidcClient();
  const role = req.query.role || 'Student'; // Default mock role

  if (oidc) {
    // Redirect to Keycloak authorization endpoint
    const authorizationUrl = oidc.authorizationUrl({
      scope: 'openid profile email',
      state: role, // Pass requested role in state for simplicity of demo
    });
    res.redirect(authorizationUrl);
  } else {
    // Fallback to Mock login in development
    console.log(`Keycloak not available. Simulating login for role: ${role}`);
    const mockUsers = {
      Admin: { name: 'Admin User', email: 'admin@system.com', roles: ['Admin'] },
      Faculty: { name: 'Dr. Alan Turing', email: 'alan@faculty.com', roles: ['Faculty'], faculty_id: 1 },
      Student: { name: 'Rohan Sharma', email: 'rohan@student.com', roles: ['Student'], student_id: 1 }
    };
    
    req.session.mockUser = mockUsers[role];
    global.activeSessions[role]++;
    res.redirect('/');
  }
});

app.get('/callback', async (req, res) => {
  try {
    const oidc = await auth.getOidcClient();
    if (!oidc) {
      return res.redirect('/login-portal');
    }

    const params = oidc.callbackParams(req);
    const tokenSet = await oidc.callback('http://localhost:3001/callback', params);
    const userinfo = await oidc.userinfo(tokenSet);
    
    // Extract roles
    const roles = auth.extractRoles(tokenSet);
    
    // Map to system users in DB by email if possible
    let studentId = null;
    let facultyId = null;
    
    if (roles.includes('Student')) {
      const dbRes = await db.query('SELECT id FROM students WHERE email = $1', [userinfo.email]);
      if (dbRes.rows.length > 0) studentId = dbRes.rows[0].id;
    } else if (roles.includes('Faculty')) {
      const dbRes = await db.query('SELECT id FROM faculty WHERE email = $1', [userinfo.email]);
      if (dbRes.rows.length > 0) facultyId = dbRes.rows[0].id;
    }

    req.session.user = {
      name: userinfo.name || userinfo.preferred_username,
      email: userinfo.email,
      roles: roles,
      student_id: studentId,
      faculty_id: facultyId
    };

    // Increment active sessions metric
    roles.forEach(role => {
      if (global.activeSessions[role] !== undefined) {
        global.activeSessions[role]++;
      }
    });

    res.redirect('/');
  } catch (err) {
    console.error('Callback error:', err.message);
    res.status(500).send('Authentication callback failed: ' + err.message);
  }
});

app.get('/logout', (req, res) => {
  const user = req.session.user || req.session.mockUser;
  if (user && user.roles) {
    user.roles.forEach(role => {
      if (global.activeSessions[role] > 0) {
        global.activeSessions[role]--;
      }
    });
  }

  req.session.destroy(() => {
    const keycloakUrl = auth.getKeycloakUrl();
    const realm = auth.getRealm();
    const clientId = auth.getClientId();
    // Redirect to Keycloak logout or main page
    if (req.session && !req.session.mockUser) {
      res.redirect(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=http://localhost:3001/login-portal`);
    } else {
      res.redirect('/login-portal');
    }
  });
});

app.get('/api/user', (req, res) => {
  const user = req.session.user || req.session.mockUser;
  const isMock = !!req.session.mockUser;
  const keycloakError = auth.getInitError();

  if (user) {
    res.json({ authenticated: true, user, isMock, keycloakError });
  } else {
    res.json({ authenticated: false, keycloakError });
  }
});

// --------------------------------------------------------
// Prometheus Metrics Export Route
// --------------------------------------------------------
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// --------------------------------------------------------
// Application API Endpoints (RBAC Protected)
// --------------------------------------------------------

// Get Student Dashboard Details (Student only)
app.get('/api/student/dashboard', auth.isAuthenticated, auth.hasRole('Student'), async (req, res) => {
  const user = req.session.user || req.session.mockUser;
  const studentId = user.student_id || 1; // Fallback to student 1 for mock demo

  try {
    const studentInfo = await db.query('SELECT * FROM students WHERE id = $1', [studentId]);
    const grades = await db.query(`
      SELECT g.*, c.course_name, c.course_code, c.credits, f.name as faculty_name
      FROM grades g
      JOIN courses c ON g.course_id = c.id
      LEFT JOIN faculty f ON c.faculty_id = f.id
      WHERE g.student_id = $1
    `, [studentId]);
    
    const attendance = await db.query(`
      SELECT a.*, c.course_name, c.course_code 
      FROM attendance a
      JOIN courses c ON a.course_id = c.id
      WHERE a.student_id = $1
      ORDER BY a.date DESC
    `, [studentId]);

    const courses = await db.query('SELECT * FROM courses');

    res.json({
      profile: studentInfo.rows[0],
      grades: grades.rows,
      attendance: attendance.rows,
      available_courses: courses.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Course Registration
app.post('/api/student/register', auth.isAuthenticated, auth.hasRole('Student'), async (req, res) => {
  const user = req.session.user || req.session.mockUser;
  const studentId = user.student_id || 1;
  const { course_id } = req.body;

  try {
    await db.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)', [studentId, course_id]);
    res.json({ success: true, message: 'Successfully registered for course!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Faculty Dashboard Details (Faculty only)
app.get('/api/faculty/dashboard', auth.isAuthenticated, auth.hasRole('Faculty'), async (req, res) => {
  const user = req.session.user || req.session.mockUser;
  const facultyId = user.faculty_id || 1; // Fallback for mock demo

  try {
    const courses = await db.query('SELECT * FROM courses WHERE faculty_id = $1', [facultyId]);
    const students = await db.query('SELECT * FROM students');
    
    // Get all enrollments for faculty's courses
    const enrollments = await db.query(`
      SELECT e.id as enrollment_id, s.id as student_id, s.name as student_name, s.email as student_email, c.id as course_id, c.course_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.faculty_id = $1
    `, [facultyId]);

    const grades = await db.query(`
      SELECT g.*, s.name as student_name, c.course_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN courses c ON g.course_id = c.id
      WHERE c.faculty_id = $1
    `, [facultyId]);

    const attendance = await db.query(`
      SELECT a.*, s.name as student_name, c.course_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN courses c ON a.course_id = c.id
      WHERE c.faculty_id = $1
      ORDER BY a.date DESC
    `, [facultyId]);

    res.json({
      courses: courses.rows,
      enrollments: enrollments.rows,
      grades: grades.rows,
      attendance: attendance.rows,
      students: students.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Grade (Faculty only)
app.post('/api/faculty/grade', auth.isAuthenticated, auth.hasRole('Faculty'), async (req, res) => {
  const user = req.session.user || req.session.mockUser;
  const facultyId = user.faculty_id || 1;
  const { student_id, course_id, grade, marks } = req.body;

  try {
    await db.query(`
      INSERT INTO grades (student_id, course_id, grade, marks, updated_by)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id, course_id)
      DO UPDATE SET grade = EXCLUDED.grade, marks = EXCLUDED.marks, updated_by = EXCLUDED.updated_by, date_updated = CURRENT_DATE
    `, [student_id, course_id, grade, marks, facultyId]);
    res.json({ success: true, message: 'Grade updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record Attendance (Faculty only)
app.post('/api/faculty/attendance', auth.isAuthenticated, auth.hasRole('Faculty'), async (req, res) => {
  const { student_id, course_id, date, status } = req.body;

  try {
    await db.query(`
      INSERT INTO attendance (student_id, course_id, date, status)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, course_id, date)
      DO UPDATE SET status = EXCLUDED.status
    `, [student_id, course_id, date, status]);
    res.json({ success: true, message: 'Attendance recorded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Admin Dashboard Stats (Admin only)
app.get('/api/admin/stats', auth.isAuthenticated, auth.hasRole('Admin'), async (req, res) => {
  try {
    const studentCount = await db.query('SELECT COUNT(*) FROM students');
    const facultyCount = await db.query('SELECT COUNT(*) FROM faculty');
    const courseCount = await db.query('SELECT COUNT(*) FROM courses');
    const enrollmentCount = await db.query('SELECT COUNT(*) FROM enrollments');
    
    // Average marks by department
    const avgMarksDept = await db.query(`
      SELECT s.department, ROUND(AVG(g.marks), 2) as avg_marks
      FROM grades g
      JOIN students s ON g.student_id = s.id
      GROUP BY s.department
    `);

    // Attendance rates
    const attendanceStats = await db.query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM attendance
      GROUP BY status
    `);

    res.json({
      counts: {
        students: parseInt(studentCount.rows[0].count),
        faculty: parseInt(facultyCount.rows[0].count),
        courses: parseInt(courseCount.rows[0].count),
        enrollments: parseInt(enrollmentCount.rows[0].count)
      },
      department_stats: avgMarksDept.rows,
      attendance_stats: attendanceStats.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all route to serve Frontend entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Student Management System running on http://localhost:${PORT}`);
});
