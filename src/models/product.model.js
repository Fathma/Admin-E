const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    pid: { type: String },
    name: { type: String, default:""},
    productName:{ type: String },
    model: { type: String, required: false },
    features: { type: Array, required: false },
    warranty: { type: String, default:"" },
    description: { type: String, default: 'None'},
    shippingInfo: {type:String, default:'None'},
    image:  { type: Array, default:[] },
    weight:  { type: String, default:"" },
    serial_availablity:{ type: Boolean },
    frontQuantity: {type:Number, default:0},
    live: { 
        quantity: { type:Number,default:0 },
        serial: { type: Array,default:[] },
        admin: { type: Schema.Types.ObjectId, ref: 'users' },
        created: { type: Date, default: Date.now }, 
    },
    availablity: { type:Boolean, default:false },
    warranted: { type: Boolean},
    sellingPrice: { type: Number , default:0},
    isActive:{ type: Boolean, default: false },
    dealer: { type: Boolean, default: false },
    status: { type: Boolean, required: false },
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    created: { type: Date, default: Date.now },
    HomePagetag: { type: String, default:'None'},
    relatedProducts: [
        { type: Schema.Types.ObjectId, ref: 'Product' },
    ]
});


module.exports = mongoose.model('Product', ProductSchema, 'products');




