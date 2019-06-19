module.exports = {
    Super: function (req, res, next) {
        if(req.user.role === "Super"){
        return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/users/dashboard");
        }
      },
      SuperPublisher: function (req, res, next) {
        if(req.user.role === "Publisher"|| req.user.role === "Super"){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/users/dashboard");
        }
      },
      SuperModerator: function (req, res, next) {
        if(req.user.role === "Moderator"|| req.user.role === "Super"){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/users/dashboard");
        }
      }
  };

  