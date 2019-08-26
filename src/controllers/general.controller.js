// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the general related controllers/ functions


// loads all required models
const Product = require('../models/product.model')
const Serial = require('../models/serials.model')
const Order = require('../models/customerOrder')
const Post = require('../models/posts.model')


// get all the data for notification and dashboard
async function notification( cb ){
  let orders = await Order.find({ currentStatus: 'New Order'})
  let newPost = await Post.find({ status: 'New'})
  let products = await Product.find()

  var count = 0
  var total_low = 0

  for( var i = 0; i< products.length; i++ ){
    var amount = await Serial.find({$and:[{pid: products[i]._id},{status: 'In Stock'}]  })
    if( amount.length < 5 ) total_low++
  }
  
  if( total_low > 0 ) count++
  if( orders.length > 0 )count++
  if( newPost.length > 0 )count++

  cb(total_low, orders.length, newPost.length, count)
}

// gets all the notifications
exports.getAllNotification=async(req, res, next) => {
  notification((quantity,new_order,newPost, count)=>{
    res.json({ quantity, new_order, newPost, count })
  })
}

// get dashboard 
exports.showDashboard =async (req, res, next) => {
  notification((quantity,new_order,newPost, count)=>{
    res.render('general/dashboard', { quantity ,  new_order, newPost, count })
  })
}

var find_duplicate_in_array = (arra1, cb)=> {
  var object = {};
  var result = [];

  arra1.forEach(function (item) {
    if(!object[item])
        object[item] = 0;
      object[item] += 1;
  })

  for (var prop in object) {
     if(object[prop] >= 2) {
         result.push(prop);
     }
  }

  cb(result);

}

var orderedProducts =async (cb)=>{
  var orders = await Order.find().populate('cart.product')
  let cart=[]
  orders.map(order=>{
    order.cart.map(item=>{
      cart.push(item)
    })
  })
  let pros = []
  cart.map(item=>{
    pros.push(item.product._id)
  })
  
  find_duplicate_in_array(pros, duplicated=>{
    
    let unique=[]
    let multi = null
    cart.map(item=>{
     
      duplicated.map(dup=>{
        if(item.product._id == dup){
          if(multi == null){
            multi=item
          }else{
            multi.quantity = multi.quantity + item.quantity
            multi.price = multi.price +item.price
          }
        }else{
          unique.push(item)
        }
      })
    })
    unique.push(multi)
    var count = 1;
    unique.map( doc=> doc.count = count++ )

    cb(unique)
  })
}
exports.bestSellers= async(req, res) => {
  orderedProducts(unique=>{
    res.render('reports/productbyOrder',{ products: unique })
  })
}

exports.productNeverSold = async(req, res) => {
  orderedProducts(async unique=>{
    let products = await Product.find()
    let productleft = products.filter(product=>{
      var bool = false
      unique.map(un=>{
        if(JSON.stringify(un.product._id) ==JSON.stringify(product._id)) bool=true
      })
      if(bool === false) return product
    })
    var count = 1;
    productleft.map( doc=> doc.count = count++ )
    res.render('reports/neverSold',{ products:productleft })
  })
}
