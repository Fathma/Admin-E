// author: Fathma siddique
// lastmodified: 16/6/2019
// description: the file has all the Customer related controllers/ functions
const Customerr = require('../models/userCustomer')
const Post = require('../models/posts.model') 
const Wishlist = require('../models/wishlist.model')
const Email = require('../helpers/email')

exports.emailAllPage = ( req, res )=> res.render('customer/emailAll')

// view list of customers
exports.viewListOfCustomers =async (req, res) => {
    let customers = await Customerr.find()
    var new_cus = []
    for(var i=0; i<customers.length; i++){
        var data = customers[i]
        console.log( customers[i]._id)
        let wishlist =await Wishlist.findOne({ owner: customers[i]._id }).populate('items.product')
        if(wishlist){
            data.items = wishlist.items
        }
        new_cus.push(data)
    }
       
    
    
    res.render('customer/customerlist',{ customer: new_cus }) 
};


exports.singleView = (req, res) => {
    Customerr.find({ _id: req.params.id },( err, docs )=> res.render('customer/singleCustomer',{ customer: docs }) )
};


// email all customer at once
exports.emailAll = ( req, res )=>{
    let emails = [] 
    Customerr.find((err, customers)=>{
        customers.map(customer=>{
            emails.push(customer.email)
        })
        Email.sendEmail( 'devtestjihad@gmail.com', emails, req.body.subject , '<p>Dear Sir,\n</p><p>' + req.body.body + '</p>\n<p>Thanks</p>\n<p>ECL</p></p>' );
    })
}


exports.getprofile = (req, res)=>{
    Customerr.findOne({ _id: req.params.id }, (err, customer)=>{
        Post.find({ user: req.params.id }, (err, posts)=>{
            res.render('customer/profile', { customer, posts })
        })
    })
}



exports.getBlock = ( req, res )=>{
    Customerr.update({ _id: req.params.id },{ $set: { isActive:false }}, ( err, customer)=>{
        res.redirect('/customers/RegisteredCustomer')
    })
}


exports.getUnblock = ( req, res )=>{
    Customerr.update({ _id: req.params.id },{ $set: { isActive:true }}, ( err, customer)=>{
        res.redirect('/customers/RegisteredCustomer')
    })
}
exports.getWishlist = ( req, res )=>{
    Wishlist.find({ owner: req.params.id })
    .populate('items.product')
    .exec (( err, wishlists )=>{
        
    })
}