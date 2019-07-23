const express = require('express')
const router = express.Router()

const invoice = require('../controllers/invoice.controller')

router.get('/invoiceList', invoice.showInvoiceList)

module.exports = router