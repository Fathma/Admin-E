// author: Fathma siddique
// lastmodified: 8/19/2019
// description: the file has all the promotion related routes 

const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const keys = require('../../config/keys')
const router = require('express').Router()
const promotions = require('../controllers/promotions.controller')
const crypto = require('crypto')
const path = require('path')
const validation = require('../helpers/validation')
var filename;

// create storage engine
const storage = new GridFsStorage(
  {
    url: keys.database.mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) return reject(err);
          
          filename = buf.toString('hex') + path.extname(file.originalname)
          const fileInfo = {
            filename: filename,
            bucketName: 'fs'
          };
          resolve(fileInfo)
        });
      });
    }
  });

const upload = multer({ storage })

router.get('/NewDiscount', promotions.NewDiscountPage)
router.get('/updateDiscount/:id', promotions.updateDiscountPage)
router.post('/SaveDiscount', validation.discount,  promotions.SaveDiscount)
router.post('/SaveUpdateDiscount',validation.discount, promotions.SaveUpdateDiscount)

router.get('/DiscountList', promotions.DiscountList)
router.get('/change/:id/:value', promotions.enableDisable)

router.get('/changeBundle/:id/:value', promotions.enableDisableBundle)
router.get('/BundleList', promotions.BundleList)
router.get('/newBundleOffer', promotions.newBundleOffer)
router.get('/updateBundle/:id', promotions.updateBundlePage)
router.post('/newBundleOfferSave', upload.single('image'), promotions.newBundleOfferSave)
router.post('/addProduct', promotions.addProduct)
router.post('/SaveUpdateBundle', promotions.SaveUpdateBundle)
router.get('/BundleProducts/delete/:id/:pid', promotions.BundleProductsDelete)
router.post('/bundleImage/update', upload.single('image'), promotions.bundleImage)
router.post('/SaveUpdateBundlePrice', promotions.SaveUpdateBundlePrice)

router.get('/NewCoupon', promotions.NewCouponPage)
router.post('/SaveCoupon',validation.couponSave, promotions.SaveCoupon)
router.get('/CouponList', promotions.CouponList)
router.get('/CouponEdit/:id', promotions.CouponEdit)
router.post('/SaveUpdateCoupon',validation.couponEdit, promotions.SaveUpdateCoupon)
router.get('/changeCoupon/:id/:value', promotions.enableDisableCoupon)
module.exports = router