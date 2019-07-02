const mongoose = require('mongoose')
const Schema = mongoose.Schema


var TagsSchema = new Schema({
    name: { type: String },
    status: { type: String, default: 'active'}
})


module.exports = mongoose.model('Tags', TagsSchema, 'tags')