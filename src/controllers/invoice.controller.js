// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the invoice related controllers/ functions
const Invoice = require('../models/invoice.model')

// view list of invoices
exports.showInvoiceList = (req, res)=>{
    Invoice.find()
    .sort({ 'created': -1 })
    .populate('user')
    .populate('order')
    .exec((err, rs)=> res.render('orders/invoiceList',{ invoices: rs }))
}

