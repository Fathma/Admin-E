// author: Fathma siddique
// lastmodified: 819/2019
// description: the file has all the promotion related controllers/ functions

// loads post model
const Discount = require('../models/discount.model')
const Bundle = require('../models/bundle.model')
const Product = require('../models/product.model')

const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const key = require('../../config/keys')
const conn = mongoose.createConnection(key.database.mongoURI);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})


// returns page for discount registration
exports.NewDiscountPage = ( req, res )=> res.render('promotions/newDiscount') 


exports.updateDiscountPage = async (req, res)=>{
    let discount = await Discount.findOne({ _id: req.params.id })
    res.render('promotions/updateDiscount',{ discount })
}

exports.updateBundlePage=async (req, res)=>{
    let bundle = await Bundle.findOne({ _id: req.params.id }).populate('products')
    let product = await Product.find()
    res.render('promotions/updateBundle',{ bundle, product })
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

exports.SaveUpdateBundle= async(req, res)=>{
    
    await Bundle.update({_id: req.body.id},{$set:req.body})
    res.redirect('/promotions/updateBundle/'+req.body.id)
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

exports.enableDisableBundle =async (req, res)=>{
    await Bundle.updateOne({ _id: req.params.id }, {$set:{ enabled: req.params.value }})
    res.redirect('/promotions/BundleList')
}


exports.BundleProductsDelete =async (req, res)=>{
    let bundle = await Bundle.findOne({ _id: req.params.id })
    bundle.products=bundle.products.filter(product=> JSON.stringify(product) != JSON.stringify(req.params.pid))
    await new Bundle(bundle).save()
    res.redirect('/promotions/updateBundle/'+req.params.id)
}


exports.newBundleOffer = async (req, res)=> res.render('promotions/newBundleOffer')

exports.BundleList = async (req, res)=>{
    let bundle =await Bundle.find()
    var count = 1;
    bundle.map( doc=> doc.count = count++ )
    res.render('promotions/listBundle', { bundle })
}

exports.newBundleOfferSave =async (req, res)=>{
    if( req.body.usePercentage === "on" ){
        req.body.usePercentage= true
        req.body.discountAmount= null
    }
    else{
        req.body.usePercentage= false
        req.body.usePercentage= null
    } 
    req.body.image = `https://ecom-admin.herokuapp.com/image/${req.file.filename}`
    new Bundle(req.body).save(()=>{
        res.redirect('/promotions/BundleList')
    })
    
}
exports.bundleImage =async (req, res)=>{
    let filename =req.file.filename
    let bundle = await Bundle.findOne({_id:req.body.id})
    let pre_file = bundle.image.split('image/')[1]
   
    gfs.remove({ pre_file },(err)=>{
        bundle.image = `https://ecom-admin.herokuapp.com/image/${filename}`
        new Bundle(bundle).save(()=>{
            res.redirect('/promotions/updateBundle/'+req.body.id)
            
        })
    })
    
    
}


exports.addProduct =async (req, res)=>{
    let bundle = await Bundle.findOne({ _id: req.body.id })
    let product = await Product.findOne({_id:req.body.product})

    bundle.products.push(req.body.product)
   
    await new Bundle(bundle).save()
    res.redirect('/promotions/updateBundle/'+req.body.id)
}


// delete image url from product 
// exports.deteteImg = (req, res)=>{
//     filename = req.body.img.split('image/')[1];
    
//     Product.updateOne({ _id: req.body.id }, { $pull: { image: req.body.img }},{ upsert: true }, ( err, docs )=>{
//       if(err) console.log(err);
//       else {
//         gfs.remove({ filename }, (err) => {
//           res.redirect( `/products/Update/${req.body.id}#IMAGES1` )
//         })
//       }
//     })
//   }

