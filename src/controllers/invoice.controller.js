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
    .exec((err, invoices)=>{
        var count = 1;
        invoices.map( doc=> doc.count = count++ )
        res.render('orders/invoiceList',{ invoices })
    })
}

