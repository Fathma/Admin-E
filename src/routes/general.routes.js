// author: Fathma siddique
// lastmodified: 7/23/2019
// description: the file has all the general  routes 

const express = require('express')
const router = express.Router()
const general = require('../controllers/general.controller')
const { ensureAuthenticated } = require("../helpers/auth");



router.get('/dashboard', general.getAllNotification)
router.get('/showDashboard',  ensureAuthenticated , general.showDashboard)
router.get('/bestSellers', ensureAuthenticated, general.bestSellers)
router.get('/productNeverSold',ensureAuthenticated, general.productNeverSold)

// router.get('/image/:filename',ensureAuthenticated, general.getImage)

module.exports = router
