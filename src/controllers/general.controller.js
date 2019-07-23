// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the general related controllers/ functions
const allFuctions = require('../helpers/allFuctions')
const Product = require('../models/product.model')
const Serial = require('../models/serials.model')
const Order = require('../models/customerOrder')
const Post = require('../models/posts.model')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const keys = require('../../config/keys')
// const con = require('../../app')


mongoose.Promise = global.Promise;

const mongoo = 'mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1';

const con = mongoose.createConnection(mongoo);

let gfs;
con.once('open', function () {
  gfs = Grid(con.db, mongoose.mongo);
  gfs.collection('fs');
})


async function notification( cb ){
  var orders = await Order.find({currentStatus: 'New Order'})
  var newPost = await Post.find({ status: 'New'})
  var products = await Product.find()

  
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