const express = require('express')
const router = express.Router()
const general = require('./general.controller')
const { ensureAuthenticated } = require("../helpers/auth");


router.get('/dashboard',ensureAuthenticated, general.getAllNotification)
router.get('/showDashboard',ensureAuthenticated, general.showDashboard)
router.get('/image/:filename', general.getImage)
module.exports = router
