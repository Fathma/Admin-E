

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


