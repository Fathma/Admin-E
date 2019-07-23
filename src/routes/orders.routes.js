const express = require('express')
const router = express.Router()

const orders = require('../controllers/orders.controller')

router.get('/orders', orders.showOrdersPage)
router.get('/generateInvoice/:oid', orders.generateInvoice)
router.get('/addSerialToProduct/:oid/:pid/:pmodel/:quantity/:item_id', orders.addSerialToProduct)
router.get('/orderDetails/:id', orders.showOrderDetails)
router.post('/updateHistory/:oid', orders.updateHistory)
router.get('/Edit/:oid/:pid/:pmodel/:quantity/:unitprice/:item_id', orders.getEditOrderPage)
router.post('/setSerials/:oid/:model_id/:item_id', orders.saveSerialInOrders)
router.get('/ViewInvoice/:id', orders.ViewInvoice)
router.post('/saveEdit/:oid/:model_id/:item_id', orders.saveEdit)
router.get('/newOrders', orders.newOrders)

module.exports = router