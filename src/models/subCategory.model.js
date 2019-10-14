//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: SubCategory model schema 

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var SubCategorySchema = new Schema({
    name: { type: String, unique:true},
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    created: { type: Date, default: Date.now },
    brands:[{
        type: Schema.Types.ObjectId, ref: 'Brand'
    }],
    enabled: { type: Boolean, default: false },
    discount:{ type: Schema.Types.ObjectId, ref: 'Discount', default:null }
})

module.exports = mongoose.model('SubCategory', SubCategorySchema, 'subCategories')