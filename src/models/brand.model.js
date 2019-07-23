const mongoose = require('mongoose')
const Schema = mongoose.Schema

let BrandSchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('Brand', BrandSchema, 'brands')