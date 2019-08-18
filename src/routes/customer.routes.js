
// author: Fathma siddique
// lastmodified: 8/7/2019
// description: the file has all the customer related routes 
const express = require('express')
const router = express.Router()

const customer = require('../controllers/customer.controller')

router.get('/RegisteredCustomer', customer.viewListOfCustomers)

router.post('/emailAll', customer.emailAll)
router.get('/email/page', customer.emailAllPage)
router.get('/profile/:id', customer.getprofile)
router.get('/block/:id', customer.Block)
router.get('/unblock/:id', customer.Unblock)

// router.get('/single/:id', customer.singleView)
// router.get('/wishlist/:id', customer.getWishlist)
module.exports = router
