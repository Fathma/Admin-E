//  Author: Fathma siddique
//  last modified: 07/23/19
//  Description: Serial model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema


var SerialSchema = new Schema({
    pid: { type: Schema.Types.ObjectId, ref: 'Product' }, 
    number: { type: String },
    sid: { type: String },
    lp:  { type: Schema.Types.ObjectId, ref: 'LocalPurchase' },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    status:{ type: String }
})


module.exports = mongoose.model('Serial', SerialSchema, 'serials')