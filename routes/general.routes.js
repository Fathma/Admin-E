const express = require('express')
const router = express.Router()
const general = require('../controllers/general.controller')

router.get('/dashboard', general.lowLiveQuantity)
router.get('/showDashboard', general.showDashboard)
module.exports = router
