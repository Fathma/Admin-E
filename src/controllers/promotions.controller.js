// author: Fathma siddique
// lastmodified: 819/2019
// description: the file has all the promotion related controllers/ functions

// loads post model
const Discount = require('../models/discount.model')


// returns page for discount registration
exports.NewDiscountPage = ( req, res )=> res.render('promotions/newDiscount') 


exports.updateDiscountPage = async (req, res)=>{
    let discount = await Discount.findOne({ _id: req.params.id })
    res.render('promotions/updateDiscount',{ discount })
}


exports.SaveDiscount = (req, res)=>{
    if(req.body.usePercentage === "on")req.body.usePercentage= true
    else req.body.usePercentage= false

    if( req.body.type == "totalOrder" ){
        if(req.body.couponrequired === "on"){
            req.body.couponrequired= true
        }
        else{
            req.body.couponrequired= false
            req.body.coupon= null
        } 
    }else{
        req.body.couponrequired= false
        req.body.coupon= null
    }

    new Discount(req.body).save().then((discount)=>{
        req.flash('success_msg', 'Discount has created successfully!')
        res.redirect('/promotions/updateDiscount/'+discount._id)
    })
}


exports.SaveUpdateDiscount=async (req, res)=>{
    if( req.body.usePercentage === "on" ){
        req.body.usePercentage= true
        req.body.discountAmount= null
    }
    else{
        req.body.usePercentage= false
        req.body.usePercentage= null
    } 
    if( req.body.type == "totalOrder" ){
        if(req.body.couponrequired === "on"){
            req.body.couponrequired= true
        }
        else{
            req.body.couponrequired= false
            req.body.coupon= null
        } 
    }else{
        req.body.couponrequired= false
        req.body.coupon= null
    }

    await Discount.update({_id: req.body.id},{$set:req.body})
    res.redirect('/promotions/updateDiscount/'+req.body.id)

}


exports.DiscountList = async (req, res)=>{
    let discount =await Discount.find()
    var count = 1;
    discount.map( doc=> doc.count = count++ )
    res.render('promotions/listDiscount', { discount })
}


exports.enableDisable =async (req, res)=>{
    await Discount.updateOne({ _id: req.params.id }, {$set:{ enabled: req.params.value }})
    res.redirect('/promotions/DiscountList')
}


exports.newBundleOffer = async (req, res)=> res.render('promotions/newBundleOffer')


