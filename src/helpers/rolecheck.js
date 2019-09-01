// check role to give access
module.exports = {
    Administrator: function (req, res, next) {
        if(req.user){
        if(req.user.role === "Administrator" || req.user.role === undefined){
        return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }}
        else{
            return next();
          }
      },
      Editor: function (req, res, next) {
        if(req.user){
        if(req.user.role === "Editor"|| req.user.role === "Administrator" || req.user.role === undefined){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }
      }else{
        return next();
      }
    },
      Contributor: function (req, res, next) {
        if(req.user){
        if(req.user.role === "Contributor"|| req.user.role === "Administrator" || req.user.role === undefined){
            return next();
        }else{
            req.flash('error_msg', 'Access Denied');
            res.redirect("/general/showDashboard");
        }
      }else{
        return next();
      }
    },
  //   testing: (object)=>{
  //     validator.isEmail(object.isEmail)
  //     if(validator.validationErrors){
  //         return 'avfdfgfd'
  //     }else{
  //       return 'false'
  //     }
  // }
  };

  