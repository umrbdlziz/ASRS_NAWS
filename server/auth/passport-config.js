const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const md5 = require("md5");
const db = require("../models/connectdb");

async function getUsers() {
  const sql = "SELECT * FROM user";
  const result = await db.executeAllSQL(sql, []);
  return result;
}

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const users = await getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === md5(password)
    );
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid username or password" });
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  done(null, user);
});

module.exports = passport;
