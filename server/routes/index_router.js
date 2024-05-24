const express = require("express");
const router = express.Router();
const db = require("../models/connectdb");
const passport = require("passport");
const methodOverride = require("method-override");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../auth/authentication-middleware");

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(methodOverride("_method")); // to be used when log out

// render index page
router.get("/", checkAuthenticated, async (req, res) => {
  try {
    const user = await req.user; // must have await
    const username = user.username;
    const role = user.role;
    const admin = role === "admin" ? true : false;

    res.render("index", {
      username: username,
      admin: admin,
      version: process.env.CURRENT_VERSION,
      public_folder: process.env.PUBLIC_FOLDER,
      folder_name: process.env.FOLDER_NAME,
    });
  } catch (err) {
    console.error(err.message);
    req.session.error = err.message;
    res.redirect(`${process.env.FOLDER_NAME}error`);
    return;
  }
});

// render login page
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", {
    public_folder: process.env.PUBLIC_FOLDER,
    folder_name: process.env.FOLDER_NAME,
  });
});

// redirect after authentication
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: `${process.env.FOLDER_NAME}`,
    failureRedirect: `${process.env.FOLDER_NAME}login`,
    failureFlash: true,
  })
);

// to logout
router.delete("/logout", async (req, res, next) => {
  try {
    const user = await req.user;
    console.log(user.username + " is logging out");
  } catch (error) {
    // no need to do anything, code below will handle
  }
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${process.env.FOLDER_NAME}login`);
  });
});

// render error page with reason of error
router.get("/error", checkAuthenticated, (req, res) => {
  const message = req.session.error;
  res.render("error", {
    error: message,
    public_folder: process.env.PUBLIC_FOLDER,
    folder_name: process.env.FOLDER_NAME,
  });
});

// render version history page
router.get("/version_history", checkAuthenticated, (req, res) => {
  res.render("version_history");
});

module.exports = router;
