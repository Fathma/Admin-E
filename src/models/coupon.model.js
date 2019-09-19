//  Author: Fathma siddique
//  last modified: 08/28/19
//  Description: coupon model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CouponSchema = new Schema({
    name: { type: String },
    code: { type: String, unique: true },
    usePercentageCoupon:{ type: Boolean, default: false },
    CouponPercent:{ type: Number },
    CouponAmount:{ type: Number },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('Coupon', CouponSchema, 'coupons')