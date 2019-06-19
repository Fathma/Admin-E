const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CustomerOrderSchema = new Schema({
    created: { type: Date,default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'Customer' },
    cart: [{
        product:{ type: Schema.Types.ObjectId, ref: 'Product' },
        quantity:{ type: Number },
        unitPrice: { type: Number },
        price:{ type: Number },
        serial:{type:Array}
    }],
    name: { type: String },
    phone: { type: Number },
    address: { type: String },
    city: { type: String },
    division: { type: String },
    paymentId: { type: String },
    totalAmount: { type: Number },
    currentStatus:{ type: String },
    lastModified:{ type: Date},
    shippingCharge:{ type: Number },
    paymentMethod:{ type: String },
    history: { type: Array },
    invoice:{ type: Schema.Types.ObjectId, ref: 'Invoice' }


});

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema, 'customerOrders');