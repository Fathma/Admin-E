
//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 15/06/2019
//  Description: User model schema for ECL E-Commerce
//Import library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Schema
var UserSchema = new Schema({
 created: { type: Date, default: Date.now },
 email: { type: String, unique: true, loadClass: true },
 password: { type: String, min: 6, max: 20 },
 name: { type: String },
 contact: { type: String },
 secretToken: { type: String },
 isActive: Boolean,
 facebook: String,
 tokens: Array,
 profile: {
   name: { type: String },
   picture: { type: String }
 },
 address: {
   name: { type: String },
   address1: { type: String },
   address2: { type: String },
   city: { type: String },
   district: { type: String },
   division: { type: String },
   country: { type: String },
   postalCode: { type: String }
 },
 billingAddress: [
   {
     billingAddressName: { type: String },
     billingAddress1: { type: String },
     billingAddress2: { type: String },
     billingAddressCity: { type: String },
     billingAddressDistrict: { type: String },
     billingAddressDivision: { type: String },
     billingAddressCountry: { type: String },
     billingAddressPostalCode: { type: String },
     billingAddressPhone: { type: String }
   }
 ],
 shippingAddress: [
   {
     shippingAddressName: { type: String },
     shippingAddress1: { type: String },
     shippingAddress2: { type: String },
     shippingAddressCity: { type: String },
     shippingAddressDistrict: { type: String },
     shippingAddressDivision: { type: String },
     shippingAddressPostalCode: { type: String },
     shippingAddressCountry: { type: String },
     shippingAddressPhone: { type: String }
   }
 ],
 shippingAddressSameAsbillingAddress: Boolean,
 history: [
   {
     paid: { type: Number, default: 0 },
     item: { type: Schema.Types.ObjectId, ref: "Product" },
     created: { type: Date, default: Date.now }
   }
 ],
 paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
 cardHolderName: { type: String, default: "" },
 creditCardLast4Digits: { type: String, default: "" },
 status: Boolean,
 isSeller: Boolean
})


module.exports = mongoose.model("Customer", UserSchema, "users")

