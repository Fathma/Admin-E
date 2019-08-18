//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: Specification model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let SpecificationSchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    filtering: {type:Boolean, default: false}
})

module.exports = mongoose.model('Specification', SpecificationSchema, 'Specifications')