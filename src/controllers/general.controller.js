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
exports.getAllNotification=async (req, res, next) => {
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
