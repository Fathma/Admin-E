const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var SupplierSchema = new Schema({
    supplier_id: { type: String },
    cname: { type: String },
    cemail: { type: String },
    country:{ type: String },
    state:{ type: String },
    address: { type: Array },
    productType: { type: String },
    industry: { type: String },
    registration_no: { type: Number },
    contactPerson:{ type: Array },
    additionalInfo: { type: String },
    created: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Supplier', SupplierSchema, 'suppliers');