const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'stud',
  user: 'root',
  password: 'Giri@1729.S!',
});

module.exports = pool;
