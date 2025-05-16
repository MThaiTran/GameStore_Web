const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    multipleStatements: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

async function connectDB() {
  try {
    await poolConnect;
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

module.exports = { sql, pool, poolConnect, connectDB };
