let currentUser = null;
let activeRole = null;
let currentDashboardData = null; // Store fetched data

// Initialize page
async function init() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    
    if (!data.authenticated) {
      window.location.href = '/login-portal';
      return;
    }
    
    currentUser = data.user;
    // For demo purposes, we pick the primary role from the user's roles array
    activeRole = currentUser.roles.find(r => ['Admin', 'Faculty', 'Student'].includes(r)) || 'Student';
    
    // Set user card details in sidebar
    document.getElementById('avatar-icon').innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-display-role').innerText = activeRole + (data.isMock ? ' (Mock)' : '');
    
    setupNavigation();
    
    // Default to corresponding role section
    if (activeRole === 'Student') {
      showSection('student');
      loadStudentData();
    } else if (activeRole === 'Faculty') {
      showSection('faculty');
      loadFacultyData();
    } else if (activeRole === 'Admin') {
      showSection('admin');
      loadAdminData();
    }
  } catch (err) {
    console.error('Initialization failed:', err);
    window.location.href = '/login-portal';
  }
}

// Generate navigation menu links based on role and permissions
function setupNavigation() {
  const menu = document.getElementById('nav-menu');
  menu.innerHTML = '';
  
  const links = [];
  
  if (activeRole === 'Student') {
    links.push({ id: 'student', label: '🎓 My Dashboard', icon: 'student' });
  } else if (activeRole === 'Faculty') {
    links.push({ id: 'faculty', label: '👨‍🏫 Faculty Console', icon: 'faculty' });
  } else if (activeRole === 'Admin') {
    links.push({ id: 'admin', label: '⚙️ Admin Stats', icon: 'admin' });
    // Admins can also inspect other roles for testing
    links.push({ id: 'student-view', label: '🎓 Student View', icon: 'student-view' });
    links.push({ id: 'faculty-view', label: '👨‍🏫 Faculty View', icon: 'faculty-view' });
  }
  
  // Monitoring link is available to Admin and Faculty
  if (activeRole === 'Admin' || activeRole === 'Faculty') {
    links.push({ id: 'monitoring', label: '📊 System Monitoring', icon: 'monitoring' });
  }
  
  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'nav-link';
    a.innerHTML = link.label;
    a.onclick = (e) => {
      e.preventDefault();
      // Remove active from all nav links
      document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
      a.classList.add('active');
      
      // Handle view redirection
      if (link.id === 'student-view') {
        showSection('student');
        loadStudentData();
      } else if (link.id === 'faculty-view') {
        showSection('faculty');
        loadFacultyData();
      } else {
        showSection(link.id);
        if (link.id === 'student') loadStudentData();
        else if (link.id === 'faculty') loadFacultyData();
        else if (link.id === 'admin') loadAdminData();
      }
    };
    li.appendChild(a);
    menu.appendChild(li);
  });
  
  // Make first link active
  if (menu.firstChild) {
    menu.firstChild.firstChild.classList.add('active');
  }
}

// Show selected dashboard section
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // Show target section
  const target = document.getElementById('section-' + sectionId);
  if (target) {
    target.classList.add('active');
  }
  
  // Update header text based on section
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  
  if (sectionId === 'student') {
    pageTitle.innerText = 'Student Academic Portal';
    pageSubtitle.innerText = 'Your grades, attendance log, and course registry';
  } else if (sectionId === 'faculty') {
    pageTitle.innerText = 'Faculty Grading & Attendance';
    pageSubtitle.innerText = 'Manage classes, student grades, and lecture records';
  } else if (sectionId === 'admin') {
    pageTitle.innerText = 'System Administration Overview';
    pageSubtitle.innerText = 'Overall database metrics and statistics';
  } else if (sectionId === 'monitoring') {
    pageTitle.innerText = 'Real-time System Performance';
    pageSubtitle.innerText = 'Prometheus scraping and Grafana metrics server';
  }
}

// --------------------------------------------------------
// STUDENT DASHBOARD DATA LOAD
// --------------------------------------------------------
async function loadStudentData() {
  try {
    const res = await fetch('/api/student/dashboard');
    const data = await res.json();
    currentDashboardData = data;
    
    // Set stats
    document.getElementById('student-courses-count').innerText = data.grades.length;
    
    // Calculate GPA
    let totalGradePoints = 0;
    let totalCredits = 0;
    const gradePointsMap = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };
    
    data.grades.forEach(g => {
      const pts = gradePointsMap[g.grade] !== undefined ? gradePointsMap[g.grade] : 7;
      totalGradePoints += pts * g.credits;
      totalCredits += g.credits;
    });
    
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.0';
    document.getElementById('student-gpa').innerText = gpa;

    // Calculate Attendance Rate
    const presentCount = data.attendance.filter(a => a.status === 'Present').length;
    const rate = data.attendance.length > 0 ? Math.round((presentCount / data.attendance.length) * 100) : 100;
    document.getElementById('student-attendance-rate').innerText = rate + '%';

    // Populate Grades Table
    const gradesBody = document.getElementById('student-grades-table');
    gradesBody.innerHTML = '';
    if (data.grades.length === 0) {
      gradesBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No academic grades available.</td></tr>';
    } else {
      data.grades.forEach(g => {
        gradesBody.innerHTML += `
          <tr>
            <td><code>${g.course_code}</code></td>
            <td><strong>${g.course_name}</strong></td>
            <td>${g.credits}</td>
            <td>${g.marks}</td>
            <td><span class="badge badge-role">${g.grade}</span></td>
          </tr>
        `;
      });
    }

    // Populate Attendance Table
    const attBody = document.getElementById('student-attendance-table');
    attBody.innerHTML = '';
    if (data.attendance.length === 0) {
      attBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No attendance records found.</td></tr>';
    } else {
      data.attendance.forEach(a => {
        const dateStr = new Date(a.date).toLocaleDateString();
        const badgeClass = a.status === 'Present' ? 'badge-present' : 'badge-absent';
        attBody.innerHTML += `
          <tr>
            <td>${dateStr}</td>
            <td><code>${a.course_code}</code></td>
            <td>${a.course_name}</td>
            <td><span class="badge ${badgeClass}">${a.status}</span></td>
          </tr>
        `;
      });
    }

    // Populate Registration Table
    const regBody = document.getElementById('student-registration-table');
    regBody.innerHTML = '';
    
    // Find courses student is not already enrolled in
    const enrolledCourseIds = data.grades.map(g => g.course_id);
    const unregisterCourses = data.available_courses.filter(c => !enrolledCourseIds.includes(c.id));
    
    if (unregisterCourses.length === 0) {
      regBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">You are registered in all available courses.</td></tr>';
    } else {
      unregisterCourses.forEach(c => {
        regBody.innerHTML += `
          <tr>
            <td><code>${c.course_code}</code></td>
            <td><strong>${c.course_name}</strong></td>
            <td>${c.credits}</td>
            <td>
              <button class="btn btn-cyan" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="registerCourse(${c.id})">Register</button>
            </td>
          </tr>
        `;
      });
    }
  } catch (err) {
    console.error('Failed to load student dashboard:', err);
  }
}

async function registerCourse(courseId) {
  try {
    const res = await fetch('/api/student/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message);
      loadStudentData(); // Refresh
    }
  } catch (err) {
    alert('Failed to register: ' + err.message);
  }
}

// --------------------------------------------------------
// FACULTY DASHBOARD DATA LOAD
// --------------------------------------------------------
async function loadFacultyData() {
  try {
    const res = await fetch('/api/faculty/dashboard');
    const data = await res.json();
    currentDashboardData = data;
    
    document.getElementById('faculty-courses-count').innerText = data.courses.length;
    document.getElementById('faculty-students-count').innerText = data.enrollments.length;

    // Populate Course Select
    const select = document.getElementById('faculty-course-select');
    select.innerHTML = '';
    data.courses.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.course_code} - ${c.course_name}</option>`;
    });

    // Default Date for attendance picker
    document.getElementById('attendance-date').value = new Date().toISOString().substring(0, 10);

    loadCourseEnrollments();
  } catch (err) {
    console.error('Failed to load faculty dashboard:', err);
  }
}

function loadCourseEnrollments() {
  const courseSelect = document.getElementById('faculty-course-select');
  const courseId = parseInt(courseSelect.value);
  if (isNaN(courseId)) return;

  const data = currentDashboardData;
  
  // Filter enrollments for this course
  const courseEnrollments = data.enrollments.filter(e => e.course_id === courseId);

  // 1. Populate Grade Panel
  const gradeBody = document.getElementById('faculty-grade-table');
  gradeBody.innerHTML = '';
  if (courseEnrollments.length === 0) {
    gradeBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No students enrolled in this course.</td></tr>';
  } else {
    courseEnrollments.forEach(e => {
      // Find existing grade if any
      const existingGrade = data.grades.find(g => g.student_id === e.student_id && g.course_id === courseId);
      const marksVal = existingGrade ? existingGrade.marks : '';
      const gradeVal = existingGrade ? existingGrade.grade : '';

      gradeBody.innerHTML += `
        <tr>
          <td><strong>${e.student_name}</strong></td>
          <td><code>${e.student_email}</code></td>
          <td>
            <input type="number" class="form-control" style="width: 80px;" id="marks-${e.student_id}" value="${marksVal}" min="0" max="100" placeholder="0-100">
          </td>
          <td>
            <select class="form-control" style="width: 80px;" id="grade-${e.student_id}">
              <option value="A+" ${gradeVal === 'A+' ? 'selected' : ''}>A+</option>
              <option value="A" ${gradeVal === 'A' ? 'selected' : ''}>A</option>
              <option value="B+" ${gradeVal === 'B+' ? 'selected' : ''}>B+</option>
              <option value="B" ${gradeVal === 'B' ? 'selected' : ''}>B</option>
              <option value="C" ${gradeVal === 'C' ? 'selected' : ''}>C</option>
              <option value="D" ${gradeVal === 'D' ? 'selected' : ''}>D</option>
              <option value="F" ${gradeVal === 'F' ? 'selected' : ''}>F</option>
            </select>
          </td>
          <td>
            <button class="btn btn-cyan" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="submitGrade(${e.student_id}, ${courseId})">Save</button>
          </td>
        </tr>
      `;
    });
  }

  // 2. Populate Attendance Panel
  const attBody = document.getElementById('faculty-attendance-table');
  attBody.innerHTML = '';
  if (courseEnrollments.length === 0) {
    attBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No students enrolled in this course.</td></tr>';
  } else {
    const selectedDate = document.getElementById('attendance-date').value;
    courseEnrollments.forEach(e => {
      // Find existing attendance status for this date
      const existingAtt = data.attendance.find(a => 
        a.student_id === e.student_id && 
        a.course_id === courseId && 
        new Date(a.date).toISOString().substring(0, 10) === selectedDate
      );
      
      const statusVal = existingAtt ? existingAtt.status : 'Present';

      attBody.innerHTML += `
        <tr>
          <td><strong>${e.student_name}</strong></td>
          <td><code>${e.student_email}</code></td>
          <td>
            <select class="form-control" style="width: 120px;" id="status-${e.student_id}">
              <option value="Present" ${statusVal === 'Present' ? 'selected' : ''}>🟢 Present</option>
              <option value="Absent" ${statusVal === 'Absent' ? 'selected' : ''}>🔴 Absent</option>
            </select>
          </td>
          <td>
            <button class="btn btn-cyan" style="padding: 0.4rem 1rem; font-size: 0.8rem;" onclick="submitAttendance(${e.student_id}, ${courseId})">Save</button>
          </td>
        </tr>
      `;
    });
  }
}

function toggleFacultyActionView() {
  const action = document.getElementById('faculty-action-select').value;
  const gradePanel = document.getElementById('faculty-grade-panel');
  const attPanel = document.getElementById('faculty-attendance-panel');

  if (action === 'grade') {
    gradePanel.style.display = 'block';
    attPanel.style.display = 'none';
  } else {
    gradePanel.style.display = 'none';
    attPanel.style.display = 'block';
  }
}

async function submitGrade(studentId, courseId) {
  const marks = parseInt(document.getElementById('marks-' + studentId).value);
  const grade = document.getElementById('grade-' + studentId).value;

  if (isNaN(marks) || marks < 0 || marks > 100) {
    alert('Please enter valid marks between 0 and 100.');
    return;
  }

  try {
    const res = await fetch('/api/faculty/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, course_id: courseId, grade, marks })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message);
      // Reload faculty records
      loadFacultyData();
    }
  } catch (err) {
    alert('Failed to update grade: ' + err.message);
  }
}

async function submitAttendance(studentId, courseId) {
  const status = document.getElementById('status-' + studentId).value;
  const date = document.getElementById('attendance-date').value;

  try {
    const res = await fetch('/api/faculty/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, course_id: courseId, date, status })
    });
    const result = await res.json();
    if (result.success) {
      alert(result.message);
      loadFacultyData();
    }
  } catch (err) {
    alert('Failed to record attendance: ' + err.message);
  }
}

// --------------------------------------------------------
// ADMIN DASHBOARD DATA LOAD
// --------------------------------------------------------
async function loadAdminData() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    
    // Set counts
    document.getElementById('admin-stat-students').innerText = data.counts.students;
    document.getElementById('admin-stat-faculty').innerText = data.counts.faculty;
    document.getElementById('admin-stat-courses').innerText = data.counts.courses;
    document.getElementById('admin-stat-enrollments').innerText = data.counts.enrollments;

    // Populate Department stats
    const deptDiv = document.getElementById('admin-dept-stats');
    deptDiv.innerHTML = '';
    data.department_stats.forEach(d => {
      // average marks as percentage
      const pct = Math.round(d.avg_marks);
      deptDiv.innerHTML += `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem;">
            <span>${d.department}</span>
            <span>Avg Marks: ${d.avg_marks}</span>
          </div>
          <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 9999px; overflow: hidden; border: 1px solid var(--glass-border);">
            <div style="background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple)); width: ${pct}%; height: 100%; border-radius: 9999px; box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);"></div>
          </div>
        </div>
      `;
    });

    // Populate Attendance stats
    const attDiv = document.getElementById('admin-attendance-stats');
    attDiv.innerHTML = '';
    const presentStat = data.attendance_stats.find(s => s.status === 'Present');
    const absentStat = data.attendance_stats.find(s => s.status === 'Absent');
    const presentPct = presentStat ? presentStat.percentage : 100;
    
    attDiv.innerHTML = `
      <div style="text-align: center;">
        <span style="font-size: 3rem; font-weight: 800; background: linear-gradient(135deg, var(--success), var(--accent-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${presentPct}%</span>
        <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">Present Attendance Rate Across All Lectures</div>
      </div>
    `;

  } catch (err) {
    console.error('Failed to load admin stats:', err);
  }
}

// --------------------------------------------------------
// LAUNCH MONITORING / GRAFANA
// --------------------------------------------------------
function openGrafana() {
  window.open('http://localhost:3000', '_blank');
}

// Trigger initial loader
init();
