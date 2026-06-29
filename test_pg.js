const { Pool } = require('pg');

async function testConnection(host) {
  const pool = new Pool({
    host: host,
    user: 'postgres',
    password: '',
    database: 'postgres',
    port: 5434,
    connectionTimeoutMillis: 2000
  });

  try {
    const res = await pool.query('SELECT 1');
    console.log(`Success with host "${host}"! Result:`, res.rows);
    await pool.end();
    return true;
  } catch (err) {
    console.log(`Failed with host "${host}": ${err.message}`);
    await pool.end();
    return false;
  }
}

async function run() {
  await testConnection('localhost');
  await testConnection('127.0.0.1');
  await testConnection('::1');
}

run();
