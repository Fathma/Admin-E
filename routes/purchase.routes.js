const express = require('express');
const router = express.Router();
const purchase = require('../controllers/purchase.controller');

router.get('/localPurchase', purchase.LocalPurchasePage);
router.get('/localPurchase/:invc', purchase.LocalPurchaseLPPage);
router.post('/SaveLocalPurchase', purchase.SaveLocalPurchase);
router.get('/getProducts/:invc', purchase.getProducts);
router.get('/getLPList', purchase.getLPList);

module.exports = router;
