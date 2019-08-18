//  checks user exists or not
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Not authorized');
    res.redirect("/users/login");
  }
};