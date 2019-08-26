// author: Fathma siddique
// lastmodified: 8/19/2019
// description: the file has all the promotion related routes 
const router = require('express').Router()
const promotions = require('../controllers/promotions.controller')

router.get('/NewDiscount', promotions.NewDiscountPage)
router.get('/updateDiscount/:id', promotions.updateDiscountPage)
router.post('/SaveDiscount', promotions.SaveDiscount)
router.post('/SaveUpdateDiscount', promotions.SaveUpdateDiscount)

router.get('/DiscountList', promotions.DiscountList)
router.get('/change/:id/:value', promotions.enableDisable)

router.get('/newPromotion', promotions.newBundleOffer)


module.exports = router