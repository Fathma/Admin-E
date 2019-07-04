// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the general related controllers/ functions
const allFuctions = require('../helpers/allFuctions')
const Product = require('../product/Product')
const Serial = require('../product/serials.model')
const Order = require('../order/customerOrder')
const Post = require('../forum/posts.model')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const gfs = require('../../app')

mongoose.Promise = global.Promise;

// const mongoo = 'mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1';

// const conn = mongoose.createConnection(mongoo);
// let gfs;
// conn.once('open', function () {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('fs');
// })

async function notification( cb ){
  var orders = await Order.find({currentStatus: 'New Order'})
  var newPost = await Post.find({ status: 'New '})
  var products = await Product.find()
  
  var count = 0
  var total_low = 0

  for(var i = 0; i< products.length;i++){
    var amount = await Serial.find({ pid: products[i]._id })
    if(amount.length < 5) total_low++
  }
  
  if(total_low > 0) count++
  if(orders.length > 0 )count++
  if(newPost.length > 0 )count++

  cb(total_low, orders.length, newPost.length, count)
}

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

//fetching image 
exports.getImage= (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if(file.filename){
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    }
  })
}