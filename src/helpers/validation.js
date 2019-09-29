

// use @hapi/joi ...
var coupon= (req)=> {
    req.checkBody("name","Name is required").notEmpty()
    req.checkBody("code","Code is required").notEmpty()
    if(req.body.usePercentageCoupon == 'on'){
        req.checkBody("CouponPercent","Coupon Percent is required").notEmpty()
    }else{
        req.checkBody("CouponAmount","CouponAmount is required").notEmpty()
    }
    if(req.validationErrors()){
        return req.validationErrors()
    }else{
        if(req.body.usePercentageCoupon == 'on'){
            req.checkBody("CouponPercent","Coupon Percent  must be in between 0-101.").isFloat({gt:0, lt:101})
        } else{
            req.checkBody("CouponAmount","Coupon Amount  is must be greater than 0").isInt({gt:0, })
        }
        return req.validationErrors() 
    } 
}
module.exports = {
    discount: async (req, res, next)=> {
        req.checkBody("name","Name is required").notEmpty()
        req.checkBody("type","Type is required").notEmpty()
        if(req.validationErrors()){
            res.render("promotions/NewDiscount",{ errors :req.validationErrors(), discount: req.body})
        }else{
            if(req.body.usePercentage == 'on'){
               
                req.checkBody("discountPercent","Discount Percent must be in between 1-100.").isFloat({gt:0, lt:101})
            } else{
                req.checkBody("discountAmount","Discount amount is must be greater than 1").isInt({gt:0, lt:101})
            }
            if(req.body.days != ''){
                req.checkBody("days","Days must be a positive whole number").isInt({gt:0})
            }
            if(req.body.maximunDiscountAmount != ''){
                req.checkBody("maximunDiscountAmount","Maximun Discount Amount must be a positive whole number").isInt({gt:0})
            }
            if(req.body.maxNumber != ''){
                req.checkBody("maxNumber","Max Number must be a positive whole number").isInt({gt:0})
            }
            if(req.validationErrors()){
                req.flash('errors', req.validationErrors())
                res.render("promotions/NewDiscount",{ discount: req.body})
            }else{
                next()
            }
        } 
    },
    couponSave:async ( req, res, next)=>{
        var errors= await coupon(req)
        if(errors)  res.render("promotions/NewCoupon",{ errors, coupon: req.body})
        else next()
    },
    couponEdit:async ( req, res, next)=>{
        var errors= await coupon(req)
        if(errors)  res.render("promotions/updateCoupon",{ errors, coupon: req.body})
        else next()
    }
    
}





// fdjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
// const Validator = require("validator");
// const isEmpty = require("./isEmpty");
// module.exports = function validateRegisterInput(data) {
//  let validationErrors = {};
//  data.name = !isEmpty(data.name) ? data.name : "";
//  data.email = !isEmpty(data.email) ? data.email : "";
//  data.password = !isEmpty(data.password) ? data.password : "";
//  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
//  if (
//    !Validator.isLength(data.name, {
//      min: 2,
//      max: 30
//    })
//  ) {
//    validationErrors.name = "Name must be between 2 and 30 characters";
//  }
//  if (!Validator.isEmail(data.email)) {
//    validationErrors.email = "Email is invalid";
//  }
//  if (Validator.isEmpty(data.name)) {
//    validationErrors.name = "Name is required";
//  }
//  if (Validator.isEmpty(data.email)) {
//    validationErrors.email = "Email is required";
//  }
//  if (Validator.isEmpty(data.password)) {
//    validationErrors.password = "Password is reqired";
//  }
//  if (Validator.isEmpty(data.confirm_password)) {
//    validationErrors.password2 = "Confirm Password is reqired";
//  }
//  if (!Validator.isAlphanumeric(data.password, "en-US")) {
//    validationErrors.password = "Password must be an alphanumeric";
//  }
//  if (!Validator.isLength(data.password, {
//      min: 6,
//      max: 30
//    })
//  ) {
//    validationErrors.password = "Password must be at least 6 characters";
//  }
//  if (!Validator.equals(data.password, data.confirm_password)) {
//    validationErrors.confirm_password = "Passwords must be matched";
//  }
//  return {
//    validationErrors: validationErrors,
//    isValid: isEmpty(validationErrors)
//  };
// };