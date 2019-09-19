
//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: Invoice model schema 
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    created: { type: Date,default: Date.now },
    invoiceId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'Customer' },
    order: { type: Schema.Types.ObjectId, ref: 'CustomerOrder' }
});

module.exports = mongoose.model('Invoice', InvoiceSchema, 'Invoices');