const sqlite3 = require("sqlite3").verbose();
const md5 = require("md5");

// database name
const DBSOURCE = process.env.DB_NAME;

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQlite database.");

    db.run(
      `CREATE TABLE "constants" (
        "constant"	TEXT NOT NULL PRIMARY KEY,
        "value"	TEXT NOT NULL,
        "description"	TEXT
    );`,
      (err) => {
        if (err) {
          // console.log("Table already exist");
        } else {
          // Table just created, can creating some rows
          console.log("constants table has been created");
          let sql =
            "INSERT INTO constants (constant, value, description) VALUES (?, ?, ?)";
          db.run(sql, [
            "server address",
            "192.168.1.0",
            "IP address of ASRS server",
          ]);
          db.run(sql, [
            "robot api",
            "192.168.1.0:0",
            "IP address of robot server",
          ]);
        }
      }
    );
    db.run(
      `CREATE TABLE "user" (
            "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
            "username"	TEXT NOT NULL UNIQUE,
            "password"	TEXT NOT NULL,
            "role"	TEXT NOT NULL,
            "profile_pic" TEXT
            );`,
      (err) => {
        let default_admin = {
          username: process.env.DEFAULT_USERNAME,
          password: md5(process.env.DEFAULT_PASSWORD),
        };
        if (err) {
          const sql = "SELECT COUNT(*) AS count FROM user WHERE role = ?";
          db.get(sql, ["admin"], (err, result) => {
            if (err) {
              console.error(err);
            } else {
              if (result.count == 0) {
                // add default admin if no admin yet
                const sql =
                  "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
                db.run(sql, [
                  default_admin.username,
                  default_admin.password,
                  "admin",
                ]);
              }
            }
          });
        } else {
          // table just created, add default admin
          console.log("user table has been created.");
          const sql =
            "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
          db.run(sql, [
            default_admin.username,
            default_admin.password,
            "admin",
          ]);
        }
      }
    );
    db.run(
      `CREATE TABLE "retrieve" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "customer" TEXT NOT NULL,
        "so_no"  TEXT NOT NULL,
        "date"	DATETIME NOT NULL,
        "item_code"	TEXT NOT NULL,
        "item_desc"	TEXT NOT NULL,
        "item_quantity"	INTEGER NOT NULL,
        "uom"	TEXT NOT NULL,
        "datetime_retrieve" DATETIME,
        "user_id" INTEGER,
        "status" BOOLEAN NOT NULL
      );`,
      (err) => {
        if (err) {
          // console.log(err);
        } else {
          // Table just created, can creating some rows
          console.log("retrieve table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "store" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "customer" TEXT NOT NULL,
        "no"  TEXT NOT NULL,
        "date"	DATETIME NOT NULL,
        "item_code"	TEXT NOT NULL,
        "item_desc"	TEXT NOT NULL,
        "item_quantity"	INTEGER NOT NULL,
        "uom"	TEXT NOT NULL,
        "datetime_store" DATETIME,
        "user_id" INTEGER,
        "status" BOOLEAN NOT NULL
      );`,
      (err) => {
        if (err) {
          // console.log(err);
        } else {
          // Table just created, can creating some rows
          console.log("store table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "station" (
      "station_id"	TEXT NOT NULL,
      "x"	NUMERIC NOT NULL,
      "y"	NUMERIC NOT NULL,
      "z"	NUMERIC NOT NULL,
      "yaw"	NUMERIC NOT NULL,
      "type"	TEXT NOT NULL,
      "is_available"	BOOLEAN,
      PRIMARY KEY("station_id")
  );`,
      (err) => {
        if (err) {
          // console.log("Table already exist");
        } else {
          // Table just created, can creating some rows
          console.log("station table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "pigeonhole" (
            "pigeonhole_id"	TEXT NOT NULL PRIMARY KEY,
            "item_code"	TEXT,
            "date" DATETIME,
            "user_id" INTEGER
        );`,
      (err) => {
        if (err) {
          // console.log(err);
        } else {
          // Table just created, can creating some rows
          console.log("pigeonhole table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "rack" (
      "rack_id"	TEXT NOT NULL UNIQUE,
      "x"	NUMERIC NOT NULL,
      "y"	NUMERIC NOT NULL,
      "z"	NUMERIC NOT NULL,
      "yaw"	NUMERIC NOT NULL,
      "is_available"	BOOLEAN,
      "pattern" NUMERIC NOT NULL,
      PRIMARY KEY("rack_id")
  );`,
      (err) => {
        if (err) {
          // console.log("Table already exist");
        } else {
          // Table just created, can creating some rows
          console.log("rack table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "pattern" (
      "pattern_id"	TEXT NOT NULL PRIMARY KEY,
      "pattern"	TEXT NOT NULL
  );`,
      (err) => {
        if (err) {
          // console.log("Table already exist");
        } else {
          // Table just created, can creating some rows
          console.log("pattern table has been created");
        }
      }
    );
    db.run(
      `CREATE TABLE "item" (
        "item_code" TEXT NOT NULL PRIMARY KEY,
        "item_desc" TEXT,
        "item_img" TEXT
      );`,
      (err) => {
        if (err) {
          // console.log(err);
        } else {
          // Table just created, can creating some rows
          console.log("item table has been created");
        }
      }
    );
  }
});

module.exports = db;
