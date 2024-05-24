const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT;
if (!port) {
  console.error("Error: The PORT environment variable is not defined.");
  process.exit(1);
}

const db = require("./models/createdb");

const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
// const initializePassport = require("./auth/passport-config");
// initializePassport(
//   passport,
//   (username) =>
//     db.executeGetSQL("select * from user where username = ?", [username]),
//   (id) => db.executeGetSQL("select * from user where id = ?", [id])
// );

// app.use(
//   session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: new MemoryStore({
//       checkPeriod: 86400000, // prune expired entries every 24h
//     }),
//     cookie: {
//       maxAge: 86400000, // Session duration in milliseconds (24h)
//     },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// close database when server is shut down
process.on("SIGINT", () => {
  console.log("Server is shutting down...");

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
      process.exit(1);
    } else {
      console.log("Database connection closed.");
      process.exit();
    }
  });
});

// any that are not found / default
app.use(function (req, res) {
  res.sendStatus(404);
});

// for production after running $npm run build in client folder
/*
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});
*/

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
