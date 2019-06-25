const express = require('express')
const router = express.Router()

const invoice = require('./invoice.controller')

router.get('/invoiceList', invoice.showInvoiceList)

module.exports = router