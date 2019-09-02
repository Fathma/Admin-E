// author: Fathma siddique
// lastmodified: 2/9/2019
// description: the file has all the Customer related controllers/ functions
const Customerr = require('../models/userCustomer.model')
const Order = require('../models/customerOrder')
const Post = require('../models/posts.model') 
const Wishlist = require('../models/wishlist.model')
const Email = require('../../config/email')
var convert = require('object-array-converter')

// fires emailall page 
exports.emailAllPage = ( req, res )=> res.render('customer/emailAll')

// view list of customers
exports.viewListOfCustomers =async (req, res) => {
    let customers = await Customerr.find()
    var new_cus = []
    // getting all customers wishlist
    for(var i=0; i<customers.length; i++){
        var data = customers[i]
        let wishlist = await Wishlist.findOne({ owner: customers[i]._id }).populate('items.product')
        if(wishlist){
            data.items = wishlist.items
        }
        new_cus.push(data)
    }
    var count = 1;
    new_cus.map( doc=> doc.count = count++ )
    res.render('customer/customerlist',{ customer: new_cus }) 
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


// shows all info of a customer
exports.getprofile =async (req, res)=>{
    var customer = await Customerr.findOne({ _id: req.params.id })
    var posts = await Post.find({ user: req.params.id })
    var orders = await Order.find({ user: req.params.id })
    var wishlists = await Wishlist.findOne({ owner: req.params.id }).populate('items.product')
    var count = 1
    customer.shippingAddress.map(shippingAddress=>{
        shippingAddress.count = count
        count++
    })
    res.render('customer/profile', { customer, posts, orders, wishlists })
}


// blocks a customer
exports.Block = ( req, res )=>{
    Customerr.update({ _id: req.params.id },{ $set: { status: false }}, ( err, customer)=>{
        res.redirect('/customers/RegisteredCustomer')
    })
}

// unblocks a customer
exports.Unblock = ( req, res )=>{
    Customerr.update({ _id: req.params.id },{ $set: { status: true }}, ( err, customer)=>{
        res.redirect('/customers/RegisteredCustomer')
    })
}


// exports.getWishlist = ( req, res )=>{
//     Wishlist.find({ owner: req.params.id })
//     .populate('items.product')
//     .exec (( err, wishlists )=>{
        
//     })
// }