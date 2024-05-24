const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const md5 = require("md5");

// This is a placeholder. Replace this with your actual user data source.
const users = [
  { id: 1, username: "admin", password: md5("admin") },
  // Add more users as needed
];

// Configure the local strategy for Passport
passport.use(
  new LocalStrategy(function (username, password, done) {
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

// Serialize user for session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(function (id, done) {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

module.exports = passport;
