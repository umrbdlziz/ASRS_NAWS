// to allow access if logged in
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${process.env.FOLDER_NAME}login`);
}

// allow access if not logged in only
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect(`${process.env.FOLDER_NAME}`);
  }
  next();
}

// allow only admin to access
async function checkAdmin(req, res, next) {
  const current_user = await req.user;
  // only admin is allowed to access
  if (current_user.role !== "admin") {
    return res.redirect(`${process.env.FOLDER_NAME}`);
  }
  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdmin,
};
