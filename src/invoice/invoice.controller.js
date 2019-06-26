const Invoice = require('./invoice.model')

// view list of customers
exports.showInvoiceList = (req, res)=>{
    Invoice.find()
    .sort({ 'created': -1 })
    .populate('user')
    .populate('order')
    .exec((err, rs)=> res.render('orders/invoiceList',{ invoices: rs }))
}

