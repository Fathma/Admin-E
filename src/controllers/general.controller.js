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
    cb(unique)
  })
}

// gets products which have sold at least once
exports.bestSellers= async(req, res) => {
  orderedProducts(unique=>{
    var count = 1;
    unique.map( doc=> doc.count = count++ )
    res.render('reports/productbyOrder',{ products: unique })
  })
}


// get products which have never been sold
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


// this funtion takes each sold products by serial/ product id. finds their purchase price and selling price. from totalSellingPrice - totalPruchasePrice = profit
function processProfitByProduct (serial, res){
  var cost = 0;
  serial.map(async ser=>{
    let pro = ser.lp.products.filter( pro=> JSON.stringify(pro.product) == JSON.stringify(ser.pid._id))
    ser.cost = pro[0].purchasePrice
    cost +=pro[0].purchasePrice
    
  })
 
  var earning = 0;
  serial.map((ser)=>{
    let pro = ser.invoice.order.cart.filter(pro=>JSON.stringify(pro.product) == JSON.stringify(ser.pid._id))
    ser.selling = pro[0].unitPrice
    earning +=  pro[0].unitPrice
   
  })

  let profit = earning-cost

  var count = 1;
  serial.map( doc=> doc.count = count++ )

  res.render('reports/profitSerialWise', {serial,cost, earning, profit})
}



exports.profitByProductCost =async (req, res)=>{
  let serial = await Serial.find({status: 'Delivered'}).populate('lp').populate('pid')
  .populate({
          path: "invoice",
          populate: { path: "order" }
        })
  processProfitByProduct(serial, res)
}


exports.profitProductWiseByMonth =async (req, res)=>{
  let month =parseInt(req.body.startDate.split('/')[0], 10)
  let year =parseInt(req.body.startDate.split('/')[1], 10)
  
  
  let serial = await Serial.find({status: 'Delivered'}).populate('lp').populate('pid')
  .populate({
    path: "invoice",
    populate: { path: "order" }
  })

  serial = serial.filter((data)=>{
    if(new Date(data.invoice.order.lastModified).getMonth()+1 === month && new Date(data.invoice.order.lastModified).getFullYear() === year){
      return data
    }
  })
  processProfitByProduct(serial, res)
}