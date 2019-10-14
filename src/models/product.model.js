//  Author: Fathma siddique
//  last modified: 04/8/19
//  Description: Product model schema 
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ProductSchema = new Schema({
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    
    pid: { type: String },
    name: { type: String, default:""},
    productName:{ type: String },
    model: { type: String, required: false },
    features: [{ 
        label: { type: Schema.Types.ObjectId, ref: 'Specification' }, 
        value: { type: String }
    }],
    warranty: { type: String, default:"" },
    description: { type: String, default: 'None'},
    shippingInfo: {
        weight:{ type:String},
        length:{ type:String },
        height:{ type:String },
        width:{ type:String},
        freeShipping:{ type:Boolean, default:'false' },
        additionalCharge:{ type:Number },
        deliveryDate:{ type:Date},
    },
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
    // availablity is to check whether the product is available
    // in stock or not
    availablity: { type:Boolean, default:false },
    warranted: { type: Boolean},
    // sellingPrice is the price shows in the client site
    sellingPrice: { type: Number , default: 0 }, 
    isActive:{ type: Boolean, default: false },
    //dealer is to check whether the product is non stock product or not
    dealer: { type: Boolean, default: false }, 
    status: { type: Boolean, required: false },
    admin: { type: Schema.Types.ObjectId, ref: 'users' },
    created: { type: Date, default: Date.now },
    //HomePagetag is for some specific sections in client site home page like special deals, tranding products etc
    HomePagetag: { type: String, default:'None'}, 
    relatedProducts: [
        { type: Schema.Types.ObjectId, ref: 'Product' },
    ],
    discount:{ type: Schema.Types.ObjectId, ref: 'Discount' }
})


module.exports = mongoose.model('Product', ProductSchema, 'products')




