module.exports = {
    Administrator: function (req, res, next) {
        if(req.user.role === "Administrator" || req.user.role === undefined){
        return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }
      },
      Editor: function (req, res, next) {
        if(req.user.role === "Editor"|| req.user.role === "Administrator" || req.user.role === undefined){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }
      },
      Contributor: function (req, res, next) {
        if(req.user.role === "Contributor"|| req.user.role === "Administrator" || req.user.role === undefined){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }
      }
  };

  