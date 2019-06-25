const allFuctions = require('../helpers/allFuctions')
const Invoice = require('../models/invoice.model')
const Product = require('../models/Product')
const Order = require('../models/customerOrder')
const Serial = require('../models/serials.model')
const Email = require('../helpers/email')

// view list of customers
exports.showOrdersPage = (req, res) => {
  Order.find()
  .populate('user')
  .exec((err, orders)=>{
    res.render('orders/orders', { orders })
  })
}

// saving serial for order
exports.saveSerialInOrders = async (req, res) => {
  var serials = req.body.Serial.split(',')
  var serial_id = []
  // getting id of the
  serials.map( async serial=>{
    var id = await Serial.findOne({$or: [{number: serial}, {sid: serial}]})
    serial_id.push(id._id)
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
     
        let serial = await Serial.find({ pid: req.params.pid })
        res.render('orders/setSerialInOrder', {
          order: order[0],
          model: req.params.pid,
          model_name: req.params.pmodel,
          item_id: req.params.item_id,
          quantity: req.params.quantity,
          serial
          // warranted: docs[0].warranted
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
    .exec((err, rs) => {
      var count = 1
      for (var i = 0; i < rs[0].order.cart.length; i++) {
        rs[0].order.cart[i].num = count;
        count++
      }
      res.render('orders/viewInvoice', { invoice: rs[0] })
    })
}

// view list of customers
exports.showOrderDetails = (req, res) => {
  allFuctions.get_orders({ _id: req.params.id }, rs => {
    if(rs){
      for (var i = 0; i < rs[0].cart.length; i++) {
        rs[0].cart[i].oid = req.params.id
        rs[0].cart[i].totalAmount = rs[0].totalAmount
      }
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
exports.updateHistory = (req, res) => {
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
    }, { upsert: true }, (err, rs2) => {
      if (err)  res.send(err)  
      else {
        // populating product id inside the cart 
        Order.populate(rs2, 'cart.product', (err1, rs) => {
          // if delivered then delete serials from live (for warranted Product)
          if (status === 'Delivered') {
            rs.cart.map(item => {
              if (item.product.warranted) {
                var arr = item.serial;
                // find the product id
                Product.findOne( { _id: item.product._id }, async (err, docs) => {
                  var all = [];
                  // convert serials into object with inventory id
                  await arr.map(selected => {
                    docs.live.serial.map(obj => {
                      if (obj.serial === selected) all.push(obj);
                    })
                  })
                  // delete serials from product live and update quantity
                  await Product.update( { _id: item.product._id },
                    {
                      $pull: { 'live.serial': { $in: all } },
                      $set: { 'live.quantity': docs.live.quantity - item.quantity }
                    },{ upsert: true }, (err, rs) => {
                      if (err) res.send(err) 
                      else console.log(all) 
                  })
                })
                // if not delivered then update history only
              } else {
                var all = []
                Product.findOne( { _id: item.product._id }, async (err, docs) => {
                  for (var i = 0; i < item.quantity; i++) {
                    all.push(item.product.live.serial[i])
                  }
                  Product.update( { _id: item.product._id },
                    {
                      $pull: { 'live.serial': { $in: all } },
                      $set: {
                        'live.quantity': docs.live.quantity - item.quantity
                      }
                    }, { upsert: true }, (err, rs) => {
                      if (err) res.send(err)
                    })
                })
              }
            })
          }
          res.redirect('/orders/orderDetails/' + req.params.oid)
        })
      }
    })
}
