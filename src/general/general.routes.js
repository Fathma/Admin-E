const express = require('express')
const router = express.Router()
const general = require('./general.controller')

router.get('/dashboard', general.getAllNotification)
router.get('/showDashboard', general.showDashboard)
module.exports = router
