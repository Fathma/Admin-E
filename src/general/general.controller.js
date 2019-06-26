// author: Fathma siddique
// lastmodified: 26/6/2019
// description: the file has all the general related controllers/ functions
const allFuctions = require('../helpers/allFuctions')
const Product = require('../product/Product')
const Serial = require('../product/serials.model')
const Order = require('../order/customerOrder')

// get low quantity for notification

async function notification( cb ){
  var orders = await Order.find({currentStatus: 'New Order'})
  var products = await Product.find()
  
  var count = 0
  var total_low = 0

  for(var i = 0; i< products.length;i++){
    var amount = await Serial.find({ pid: products[i]._id })
    if(amount.length < 5) total_low++
  }
  
  
  if(total_low > 0) count++
  if(orders.length > 0 )count++
  cb(total_low, orders.length, count)
}

exports.lowLiveQuantity=async (req, res, next) => {
  notification((quantity,new_order, count)=>{
    res.json({ quantity, new_order, count })
  })
  
 
  
}

// get dashboard 
exports.showDashboard =async (req, res, next) => {
  notification((quantity,new_order, count)=>{
    res.render('general/dashboard', { quantity ,  new_order, count })
   
  })
  
}