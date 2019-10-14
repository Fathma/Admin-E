//  Author: Fathma siddique
//  last modified: 08/26/19
//  Description: Bundle model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema



let BundleSchema = new Schema({
    image: { type: String },
    name: { type: String },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: false },
    sellingPrice: { type: Number },
    days: { type: Number },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
   
})

module.exports = mongoose.model('Bundle', BundleSchema, 'bundles')