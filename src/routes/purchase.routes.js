// author: Fathma siddique
// lastmodified: 23/7/2019
// description: the file has all the purchase routes
const express = require('express');
const router = express.Router();
const purchase = require('../controllers/purchase.controller');

router.get('/localPurchase', purchase.LocalPurchasePage);
router.get('/localPurchase/:invc', purchase.LocalPurchaseLPPage);
router.post('/SaveLocalPurchase', purchase.SaveLocalPurchase);
router.get('/getProducts/:invc', purchase.getProducts);
router.get('/getLPList', purchase.getLPList);
router.get('/productList/:_id', purchase.productList);
router.get('/deleteProduct/:lpid/:pid', purchase.deleteProduct);


module.exports = router;
