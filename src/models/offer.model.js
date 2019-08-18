
//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: Offer model schema 
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var OfferSchema = new Schema({
    created: { type: Date,default: Date.now },
    name: { type: String },
    discountPercentage: { type: Number },
    products: { type: Schema.Types.ObjectId, ref: 'Product' },
});

module.exports = mongoose.model('Offer', OfferSchema, 'offers');