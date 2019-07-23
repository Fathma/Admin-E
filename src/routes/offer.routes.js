const express = require('express')
const router = express.Router()
const offer = require('../controllers/offer.controller')



router.get('/setDiscountPage', offer.setDiscountPage)

module.exports = router
