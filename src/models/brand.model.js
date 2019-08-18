//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: Brand model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BrandSchema = new Schema({
    name: { type: String },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('Brand', BrandSchema, 'brands')