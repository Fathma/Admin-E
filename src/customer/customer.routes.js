const express = require('express')
const router = express.Router()

const customer = require('./customer.controller')

router.get('/RegisteredCustomer', customer.viewListOfCustomers)
router.get('/single/:id', customer.singleView)
router.post('/emailAll', customer.emailAll)
router.get('/email/page', customer.emailAllPage)
router.get('/wishlist/:id', customer.getWishlist)
router.get('/profile/:id', customer.getprofile)
router.get('/block/:id', customer.getBlock)
router.get('/unblock/:id', customer.getUnblock)
module.exports = router
