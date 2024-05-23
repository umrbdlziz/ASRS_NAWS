const mysql = require("mysql2");
const md5 = require("md5");

// Create a connection pool
const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

// run query
function executeRunSQL(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          changes: result.affectedRows,
          lastID: result.insertId,
        });
      }
    });
  });
}

// return all row
function executeAllSQL(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// return one row only
function executeGetSQL(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0] || null); // Return the first row or null
      }
    });
  });
}

function createdb() {
  console.log("Creating Tables");
  // create tables
}

module.exports = {
  executeRunSQL,
  executeAllSQL,
  executeGetSQL,
  createdb,
};
