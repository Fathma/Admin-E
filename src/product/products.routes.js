const express = require('express')
const router = express.Router()
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const product_controller = require('./product.controller')
const { ensureAuthenticated } = require("../helpers/auth");
mongoose.Promise = global.Promise;

const mongoo = 'mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1';

const conn = mongoose.createConnection(mongoo);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})
var filename;

// create storage engine
const storage = new GridFsStorage(
  {
    url: mongoo,
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


// 23/4/2019 new
router.get('/InhouseInventory', ensureAuthenticated, product_controller.getInhouseInventoryPage)
router.get('/DealerInventory', ensureAuthenticated, product_controller.getDealerInventoryPage)
router.post('/regiSave', ensureAuthenticated, product_controller.SaveProductLP)
router.post('/regiSaveDealer', ensureAuthenticated, product_controller.SaveProductDealer)
router.post('/showfields', ensureAuthenticated, product_controller.showProductRegistrationFields)
router.post('/upload', ensureAuthenticated, upload.array('imagePath'), product_controller.SaveImage)
router.post('/upload/dealer', ensureAuthenticated, upload.array('imagePath2'), product_controller.SaveImage2)
router.post('/upload/update', ensureAuthenticated, upload.array('imagePath3'), product_controller.SaveImage3)
router.get('/image/:filename', product_controller.getImage)
router.post('/img/detete', ensureAuthenticated, product_controller.deteteImg)
router.post('/checkSerials', ensureAuthenticated, product_controller.checkSerials)
router.get('/Update/:_id', ensureAuthenticated, product_controller.getProductUpdatePage)
router.post('/updateProduct', ensureAuthenticated, product_controller.updateProduct)
router.get('/active/:id', ensureAuthenticated, product_controller.makeActive)
router.get('/unactive/:id', ensureAuthenticated, product_controller.makeNotActive)
router.get('/Available/:id', ensureAuthenticated, product_controller.makeAvailable)
router.get('/notAvailable/:id', ensureAuthenticated, product_controller.makeNotAvailable)
router.get('/serials', ensureAuthenticated, product_controller.getSerials)
router.get('/viewLowQuantityProducts', ensureAuthenticated, product_controller.viewLowQuantityProducts)


// previous 
// Edit (Inventory With Serial number)
router.get("/stockEditPage/:lot_id/:pid", product_controller.getEditStockPage)
router.get( "/Edit/:id", product_controller.getEditpage )
router.post( "/EditAddOne/:lot_id/:pid", product_controller.editAddNew )
router.post( "/EditReplace/:lot_id/:pid", product_controller.EditReplace )
router.post( "/EditDelete/:lot_id/:pid", product_controller.EditDelete )
router.post( "/EditPP/:lot_id/:pid", product_controller.EditPP )
// router.get("/newLot", product_controller.newLot)

// Edit (Inventory Without Serial number)
router.get("/stockEditNoSerialPage/:lot/:pid", product_controller.stockEditNoSerialPage)
router.post("/stockEditNoSerial/:lot/:pid", product_controller.stockEditNoSerial)

// views
router.get("/view", product_controller.getAllProducts)
router.get("/Online", product_controller.getOnlineProductsPage)
router.get("/offline", product_controller.getOfflineProductsPage)
// router.get("/viewLowLive", product_controller.lowLiveQuantityDetails)
router.post("/getProductBySubcatNoSL/:sub_cat", product_controller.getProductBySubcatNoSerial)
router.post("/getProductByCatNoSL/:cat", product_controller.getProductByCatNoSerial)
router.get("/getProductBySubcatNoSL/:sub_cat", product_controller.getProductBySubcatNoSerial)
router.get("/getProductByCatNoSL/:cat", product_controller.getProductByCatNoSerial)
router.get("/getProductBySubcat_filter/:sub_cat", product_controller.getProductBySub_filter)
router.get("/getProductBySubcat/:sub_cat", product_controller.getProductBySubcat)
router.post("/getProductBySubcat/:sub_cat", product_controller.getProductBySubcat)
router.get("/getProductByCat/:cat", product_controller.getProductByCat)
router.post("/getProductByCat/:cat", product_controller.getProductByCat)
// router.get("/StockLowToHigh", product_controller.StockLowToHigh)
// router.get("/StockHighToLow", product_controller.StockHighToLow)
router.get("/getProductByCat_filter/:cat", product_controller.getProductByCat_filter)
// router.get("/viewStock/:id", product_controller.viewStock)
router.get("/stockInfo/:id", product_controller.stockInfo)
router.get("/viewProducts", product_controller.viewProducts)
// validation
router.get("/check_availablity/:model", product_controller.check_availablity)

router.post("/saveLive/:id", product_controller.saveLive)
// live
// router.get("/liveStockEdit/:id/:pid", product_controller.getLiveStockEditpage)
// router.get("/liveStockEditNoSerial/:id/:pid", product_controller.getLiveStockEditNoSerialpage)
// router.get("/RestoreLivepage/:id", product_controller.getRestoreLivepage)
// router.get("/RestoreLiveNoserialPage/:id", product_controller.RestoreLiveNoserialPage)
// router.post("/Restore/:id", product_controller.getRestoreLive)


router.post("/search", product_controller.getSearchResult);


module.exports = router;
