//  Author: Fathma siddique
//  last modified: 08/28/19
//  Description: coupon model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CouponSchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('Coupon', CouponSchema, 'coupons')