const express = require('express')
const router = express.Router()
const offer = require('./offer.controller')



router.get('/setDiscountPage', offer.setDiscountPage)

module.exports = router
