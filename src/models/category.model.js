//  Author: Fathma siddique
//  last modified: 08/22/19
//  Description: Category model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CategorySchema = new Schema({
    name: { type: String, unique: true },
    subCategories:[{ type: Schema.Types.ObjectId, ref: 'SubCategory'}],
    brands:[{ type: Schema.Types.ObjectId, ref: 'Brand' }],
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: false },
    discount:{ type: Schema.Types.ObjectId, ref: 'Discount', default:null }
})

module.exports = mongoose.model('Category', CategorySchema, 'categories');