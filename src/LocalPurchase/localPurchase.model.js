const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var LocalPurchaseSchema = new Schema({
    date: { type:Date },
    number: { type: String, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    address: { type: String },
    contactPerson: { type: String },
    mobile: { type: String },
    dealer: { type: String },
    products:[{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity:{ type: Number},
        purchasePrice:{ type: Number},
        total:{ type: Number}
    }],
    subTotal:{ type: Number}
});
module.exports = mongoose.model('LocalPurchase', LocalPurchaseSchema, 'LocalPurchases');