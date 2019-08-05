const allFuctions = require('../helpers/allFuctions')
const Invoice = require('../models/invoice.model')
const Product = require('../models/product.model')
const Order = require('../models/customerOrder')
const Serial = require('../models/serials.model')
const Email = require('../../config/email')

// view list of customers
exports.showOrdersPage = (req, res) => {
  Order.find()
  .populate('user')
  .exec((err, orders)=>{
    var count = 1;
    orders.map( doc=> doc.count = count++ )
    res.render('orders/orders', { orders })
  })
}

// saving serial for order
exports.saveSerialInOrders = async (req, res) => {
  var serials = req.body.Serial.split(',')
  var serial_id = []
  // getting id of the
  serials.map( async serial=>{
    var id = await Serial.find({$or: [{number: serial}, {sid: serial}]})
    id.map( new_id =>{
      if(new_id.pid == req.params.model_id){
        serial_id.push(new_id._id)
      }
    })
  })
  var docs = await Order.findOne({ _id: req.params.oid })
  docs.cart.map(item=>{
    if(item._id == req.params.item_id){
      item.serials = serial_id
      new Order(docs).save().then(()=>{
      res.redirect('/orders/orderDetails/' + req.params.oid)
      })
    }
  })
}

// edit ordered products' quantity
exports.saveEdit = (req, res) => {
  Order.find({ _id: req.params.oid }, (err, docs) => {
    var total = 0
    docs[0].cart.map(items => {
      if (items._id != req.params.item_id)  total += items.price
    })

    Order.update(
      { _id: req.params.oid, 'cart._id': req.params.item_id },
      {
        $set: {
          'cart.$.quantity': req.body.quantity,
          'cart.$.price': req.body.quantity * parseInt(req.body.unitprice),
          totalAmount:
            total + parseInt(req.body.quantity) * parseInt(req.body.unitprice)
        }
      },
      { upsert: true }, (err, rs) => {
        if (err) res.send(err);
        else res.redirect('/orders/orderDetails/' + req.params.oid)
    })
  })
}

// returns the page to add serial to an ordered product
exports.addSerialToProduct = (req, res) => {
  allFuctions.get_orders({ _id: req.params.oid }, order => {
    Product.findOne({ _id: req.params.pid }, async function(err, docs) {

      let serial = await Serial.find({ $and: [{ pid: req.params.pid} , {status: 'In Stock'}] })
      res.render('orders/setSerialInOrder', {
        order: order[0],
        model: req.params.pid,
        model_name: req.params.pmodel,
        item_id: req.params.item_id,
        quantity: req.params.quantity,
        serial
      })
    })
  })
}

exports.getEditOrderPage = (req, res) => {
  res.render('orders/editOrder', {
    oid: req.params.oid,
    model: req.params.pid,
    model_name: req.params.pmodel,
    unitprice: req.params.unitprice,
    quantity: req.params.quantity,
    item_id: req.params.item_id,
    totalAmount: req.params.total
  })
}

// view list of customers
exports.ViewInvoice = (req, res) => {
  Invoice.find({ _id: req.params.id })
    .populate('user')
    .populate({
      path: 'order',
      populate: { path: 'user' }
    })
    .populate({
      path: 'order',
      populate: { path: 'cart.product' }
    })
    .populate({
      path: 'order',
      populate: { path: 'cart.serials' }
    })
    .exec((err, rs) => {
      var count = 1
      if(rs[0].order.cart != null ){
        for (var i = 0; i < rs[0].order.cart.length; i++) {
          rs[0].order.cart[i].num = count;
          count++
        }
      }
      res.render('orders/viewInvoice', { invoice: rs[0] })
    })
}

// view list of customers
exports.showOrderDetails = (req, res) => {
  allFuctions.get_orders({ _id: req.params.id }, async rs => {
    if(rs){
     
      for (var i = 0; i < rs[0].cart.length; i++) {
        rs[0].cart[i].oid = req.params.id
        rs[0].cart[i].totalAmount = rs[0].totalAmount
      }
     
      var invoice = await Invoice.findOne({ order:rs[0]._id })
      rs[0].invoice = invoice;
     
      res.render('orders/orderDetails', { order: rs[0], or_id: req.params.id })
    }
  })
}

// generate invoice
exports.generateInvoice = (req, res) => {
  var invoice = {
    user: req.user._id,
    order: req.params.oid
  };

  new Invoice(invoice).save().then(invoice => {
    Order.update( { _id: req.params.oid }, { $set: { invoice: invoice._id } }, (err, docs) => {
        allFuctions.get_orders({ _id: req.params.oid }, rs => {
          var count = 1;
          for (var i = 0; i < rs[0].cart.length; i++) {
            rs[0].cart[i].num = count;
            count++;
          }
          res.render('orders/invoice', {
            title: 'Invoice',
            order: rs[0],
            user: req.user,
            invoice: invoice._id
          })
        })
      })
  })
}

// updateting order history
exports.updateHistory =async (req, res) => {
  var status = req.body.status

  if (req.body.notify === '1') {
    var notify = 'Yes'
    Email.sendEmail( 'devtestjihad@gmail.com', req.body.email, 'ECL update', '<h2>' + req.body.comment + '</h2>' );
  } else var notify = 'No' 

  var history = {
    date: new Date(),
    comment: req.body.comment,
    status: req.body.status,
    customerNotified: notify
  };

  // updating order history
  Order.findOneAndUpdate( { _id: req.params.oid },
    {
      $addToSet: { history: history },
      currentStatus: status,
      lastModified: new Date()
    }, { upsert: true },async (err, rs2) => {
      if (err)  res.send(err)  
      else {
        
        if(status === "Delivered"){
          var invoice = await Invoice.findOne({ order:rs2._id })
         
          rs2.cart.map( item=>{
            console.log(item)
            item.serials.map(async serial=>{
              console.log(serial)
              await Serial.update({ _id: serial },{$set: { status:'Delivered', invoice: invoice._id }})

            })
          })
        }
        res.redirect('/orders/orderDetails/' + req.params.oid)
      }
    })
}


exports.newOrders = (req, res)=>{
  Order.find({ currentStatus: 'New Order'})
  .populate('user')
  .exec((err, orders)=>{
    var count = 1;
    orders.map( doc=> doc.count = count++ )
    res.render('orders/orders', { orders })
  })
}
