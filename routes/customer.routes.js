const express = require('express')
const router = express.Router()

const customer = require('../controllers/customer.controller')

router.get('/RegisteredCustomer', customer.viewListOfCustomers)
router.get('/single/:id', customer.singleView)
router.post('/emailAll', customer.emailAll)
router.get('/email/page', customer.emailAllPage)
router.get('/wishlist/:id', customer.getWishlist)
module.exports = router
