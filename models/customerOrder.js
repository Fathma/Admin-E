
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var CustomerOrderSchema = new Schema({
 created: { type: Date, default: Date.now },
 orderId: { type: String },
 user: { type: Schema.Types.ObjectId, ref: "Customer" },
 cart: [
   {
     product: { type: Schema.Types.ObjectId, ref: "Product" },
     quantity: { type: Number },
     unitPrice: { type: Number },
     price: { type: Number },
     serials: [ { type: Schema.Types.ObjectId, ref: "Serial" } ]
   }
 ],
 shippingAddress: {
   shippingAddressName: { type: String },
   shippingAddress1: { type: String },
   shippingAddress2: { type: String },
   shippingAddressCity: { type: String },
   shippingAddressDistrict: { type: String },
   shippingAddressDivision: { type: String },
   shippingAddressPostalCode: { type: String },
   shippingAddressCountry: { type: String },
   shippingAddressPhone: { type: String }
 },
 paymentMethod: { type: String },
 paymentId: { type: String },
 shippingCharge: { type: Number },
 totalAmount: { type: Number },
 currentStatus: { type: String, default: "New Order" },
 history: { type: Array },
 lastModified: { type: Date, default: Date.now }
});



module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema, 'customerOrders');