const express = require('express')
const router = express.Router()
const general = require('../controllers/general.controller')
const { ensureAuthenticated } = require("../helpers/auth");


router.get('/dashboard', general.getAllNotification)
router.get('/showDashboard',ensureAuthenticated, general.showDashboard)
router.get('/image/:filename',ensureAuthenticated, general.getImage)

module.exports = router
