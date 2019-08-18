// author: Fathma siddique
// lastmodified: 23/7/2019
// description: the file has all the general  routes
const express = require('express')
const router = express.Router()

const invoice = require('../controllers/invoice.controller')

router.get('/invoiceList', invoice.showInvoiceList)

module.exports = router