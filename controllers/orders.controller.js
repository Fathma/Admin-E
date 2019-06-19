const allFuctions = require('../helpers/allFuctions')
const Invoice = require('../models/invoice.model')
const Product = require('../models/Product')
const Order = require('../models/customerOrder')
const Email = require('../helpers/email')

// view list of customers
exports.showOrdersPage = (req, res) => {
  allFuctions.get_orders({}, rs => {
    res.render('orders/orders', { orders: rs })
  })
}

// saving serial for order
exports.saveSerialInOrders = (req, res) => {
  var serials = req.body.Serial.split(',')
  Order.update(
    { _id: req.params.oid, 'cart._id': req.params.item_id },
    { $set: { 'cart.$.serial': serials } },
    { upsert: true },
    (err, rs) => {
      if (err) res.send(err);
      res.redirect('/orders/orderDetails/' + req.params.oid)
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
  allFuctions.get_orders({ _id: req.params.oid }, rs => {
    Product.find({ _id: req.params.pid }, function(err, docs) {
      if (docs[0].warranted) {
        res.render('orders/setSerialInOrder', {
          order: rs[0],
          model: req.params.pid,
          model_name: req.params.pmodel,
          item_id: req.params.item_id,
          quantity: req.params.quantity,
          serial: docs[0].live.serial,
          warranted: docs[0].warranted
        })
      } else {
        req.flash('error_msg', 'Unwarranted product!');
        res.redirect('/orders/orderDetails/' + req.params.oid);
      }
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
    for (var i = 0; i < rs[0].cart.length; i++) {
      rs[0].cart[i].oid = req.params.id
      rs[0].cart[i].totalAmount = rs[0].totalAmount
    }
    res.render('orders/orderDetails', { order: rs[0], or_id: req.params.id })
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
