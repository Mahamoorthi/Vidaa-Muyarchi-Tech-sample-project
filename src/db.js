const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  user: 'postgres',
  password: '',
  database: 'student_management',
  port: 5434,
  max: 10,
  idleTimeoutMillis: 30000
});

function getDurationInSeconds(start) {
  const diff = process.hrtime(start);
  return diff[0] + diff[1] / 1e9;
}

const db = {
  query: async (text, params) => {
    const start = process.hrtime();
    try {
      const res = await pool.query(text, params);
      const duration = getDurationInSeconds(start);
      
      // Observe database query duration in Prometheus
      if (global.dbQueryDuration) {
        global.dbQueryDuration.observe(duration);
      }
      
      return res;
    } catch (err) {
      console.error('Database query error:', err.message, 'Query:', text);
      throw err;
    }
  },
  pool
};

module.exports = db;
