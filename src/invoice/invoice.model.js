const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    created: { type: Date,default: Date.now },
    invoiceId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    order: { type: Schema.Types.ObjectId, ref: 'CustomerOrder' },
});

module.exports = mongoose.model('Invoice', InvoiceSchema, 'Invoices');