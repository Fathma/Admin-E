const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const crypto = require('crypto');
// const Joi = require('joi');

//Schema
var UserSchema = new Schema({

    created: { type: Date, default: Date.now },
    email: { type: String, unique: true, loadClass: true },
    password: { type: String, min:6, max: 20},
    name: { type: String, default: '' },
    contact: { type: String, default: '' },
    secretToken: { type: String },
    isActive: Boolean,
    facebook: String,
    tokens: Array,
    
    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: ''}
    },
    address: {
        address1: { type: String, default: '' },
        address2: { type: String, default: '' }, 
        city: { type: String, default: '' },
        district: { type: String, default: '' },
        country: { type: String, default: '' },
        postalCode: { type: String, default: '' },
    },
    billingAddress: {
        billingAddressName: { type: String, default: '' },
        billingAddress1: { type: String, default: '' },
        billingAddress2: { type: String, default: '' },
        billingAddressStreet: { type: String, default: '' },
        billingAddressArea: { type: String, default: '' },
        billingAddressCity: { type: String, default: '' },
        billingAddressDistrict: { type: String, },
        billingAddressCountry: { type: String, default: '' },
        billingAddressPostalCode: { type: String, default: '' },
        billingAddressPhone: { type: String, default: '' }
    },
    shippingAddress: {
        shippingAddressName: { type: String, default: '' },
        shippingAddress1: { type: String, default: '' },
        shippingAddress2: { type: String, default: '' },
        shippingAddressStreet: { type: String, default: '' },
        shippingAddressArea: { type: String, default: '' },
        shippingAddressCity: { type: String, default: '' },
        shippingAddressDistrict: { type: String, default: '' },
        shippingAddressCountry: { type: String, default: '' },
        shippingAddressPostalCode: { type: String, default: '' },
        shippingAddressPhone: { type: String, default: '' }
    },

    shippingAddressSameAsbillingAddress: Boolean,
    history: [{
        paid: { type:Number, default:0 },
        item: { type: Schema.Types.ObjectId, ref: 'Product' },
        created: { type: Date, default: Date.now }
    }],
      
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'PaymentMethod' },
    cardHolderName: { type: String, default: '' },
    creditCardLast4Digits: { type: String, default: '' },
    status: Boolean,
    isSeller: Boolean
});


module.exports = mongoose.model('Customer', UserSchema, 'users');