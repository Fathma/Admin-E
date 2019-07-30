const mongoose = require('mongoose')
const Schema = mongoose.Schema

let SpecificationSchema = new Schema({
    name: { type: String, unique: true },
    created: { type: Date, default: Date.now },
    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('Specification', SpecificationSchema, 'Specifications')