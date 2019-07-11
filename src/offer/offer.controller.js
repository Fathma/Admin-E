// author: Fathma siddique
// lastmodified: 27/6/2019
// description: the file has all the general related controllers/ functions
const Product = require('../product/Product')
const Offer = require('./offer.model')


exports.setDiscountPage= async (req, res, next) => {
  res.render('offer/setDiscount')
}

