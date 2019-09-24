// author : fathma Siddique
// lastmodified : 31/7/2019
// description : all the product related controllers/funtions are written in here 

//Imports
var mongo = require('mongodb')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const key= require('../../config/keys')

// loads all the requires models
const Product = require('../models/product.model')
const Category = require('../models/category.model')
const SubCategory = require('../models/subCategory.model')
const Specification = require('../models/specification.model')
const Serial = require('../models/serials.model')
const LocalPurchase = require('../models/localPurchase.model')
const Brand = require('../models/brand.model')
const Discount = require('../models/discount.model')

mongoose.Promise = global.Promise;

const conn = mongoose.createConnection(key.database.mongoURI);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})

// fires the page to create new product specification 
exports.SpecificationsNew = (req, res)=> res.render('products/newSpecification')


// fires the page if new specification need while registering a product. 
// that id is to go back that specific product after adding new specification
exports.SpecificationsNewId = (req, res)=> {
  res.render('products/newSpecification', { id: req.params.id})
}

// making a product disable
exports.makeDisabled =async (req, res)=>{
  await Specification.update({ _id: req.params.sid }, {$set: { enabled: false } })
  res.redirect('/products/Specifications#'+req.params.sid)
}

// making a product enable
exports.makeEnabled =async (req, res)=>{
  await Specification.update({ _id: req.params.sid }, {$set: { enabled: true } })
  res.redirect('/products/Specifications#'+req.params.sid)
}


// making filtering false of a specification
exports.specificationMakeFalse =async (req, res)=>{
  await Specification.update({ _id: req.params.sid }, {$set: { filtering: false } })
  res.redirect('/products/Specifications#'+req.params.sid)
}


// making filtering false of a specification
exports.specificationMakeTrue =async (req, res)=>{
  await Specification.update({ _id: req.params.sid }, {$set: { filtering: true } })
  res.redirect('/products/Specifications#'+req.params.sid)
}

// save new specification
exports.SpecificationsSave = (req, res)=>{
  // check whether it is already exists or not 
  Specification.findOne({ name: req.body.specification}, (err, specifications)=>{
    if(!specifications){
      let obj = {
        name: req.body.specification,
        createdBy: req.user._id
      }
      
      //  if product id exist then it will redirect to that product update page
      if(req.body.id){
        new Specification(obj).save().then(()=>{
          res.redirect('/products/Update/'+req.body.id+'#SPECIFICATIONS1')
        })
      }else{
        new Specification(obj).save().then(()=>{
          res.redirect('/products/specifications/new')
        })
      }
     
    }
    else{
      req.flash('error_msg', 'Already exists!')
      res.redirect('/products/specifications/new')
    }
  })
}

//  shows list od specification
exports.Specifications =async (req, res)=>{
  var specifications = await Specification.find().populate('createdBy')
  var count = 1;
  specifications.map( doc=> doc.count = count++ )
  res.render('products/specifications',{ specifications })
  
}

// save shipping in fo of a product
exports.shippingSave = async(req, res)=>{
  
  let prod = await Product.findOne({ _id: req.body.pid })
  let shippingInfo = {
    weight: req.body.weight,
    height: req.body.height,
    width: req.body.width,
    length: req.body.length,
    freeShipping: req.body.freeShipping,
    additionalCharge: req.body.additionalCharge,
    deliveryDate: req.body.deliveryDate,
  }
  
  prod.shippingInfo=shippingInfo

  new Product(prod).save().then(()=>{
    res.redirect('/products/Update/'+ req.body.pid+'#Shipping1')
  })
}

exports.SavePrice =async (req, res)=>{
  if(req.body.discount == '') req.body.discount=null
  await Product.update({ _id: req.body.pid }, {$set:req.body})
  res.redirect('/products/Update/'+ req.body.pid+'#PRICE')
}

// added attribute to a product
exports.SaveAttribute = async (req, res)=>{
  let prod = await Product.findOne({ _id: req.body.pid })
  let attribute = {
    label: req.body.label,
    value: req.body.value
  }
  
  prod.features.push(attribute)

  new Product(prod).save().then(()=>{
    res.redirect('/products/Update/'+ req.body.pid+'#SPECIFICATIONS1')
  })
}
// saves homePage tags
exports.SaveHomePageTag = async (req, res)=>{
  await Product.update({_id: req.body.pid},{ $set:{HomePagetag: req.body.HomePagetag} })
  res.redirect('/products/Update/'+ req.body.pid+'#ProductTag1')
}

// deletes an attribute from a product
exports.deleteAttribute = async (req, res)=>{
  let prod = await Product.findOne({ _id: req.params._id })

  prod.features = prod.features.filter(function(feature, index, arr){
    return feature.label.toString() !== req.params.label;
  });

  new Product(prod).save().then(()=>{
    res.redirect('/products/Update/'+ req.params._id+'#SPECIFICATIONS1')
  })

}


// saves related products to a product
exports.relatedProducts1 =async (req, res)=>{
  let _id = req.body.pid;
  let prod = await Product.findOne({_id})
  if(prod.relatedProducts.includes(req.body.relatedProducts)){
    res.redirect('/products/Update/'+_id)
  }else{
    prod.relatedProducts.push(req.body.relatedProducts)
    new Product(prod).save().then(async (pro)=>{
      res.redirect('/products/Update/'+_id+"#RELATED")
    })
  }
}
 

// deletes a related product
exports.relatedProductsDelete1 = async(req, res)=>{
  // delete_related (req)
  let product = await Product.findOne({ _id: req.params.pid })
  
  let el = product.relatedProducts.filter((ele)=>{
    return ele != req.params.rid
  })
  product.relatedProducts = el
  new Product(product).save().then(()=>{
    res.redirect('/products/Update/'+req.params.pid+"#RELATED1")
  })
  
}

// viewProducts
exports.viewProducts = (req, res)=>{
  Product.find().sort({'created': -1}).exec((err, products)=>{
    var count = 1;
    products.map( doc=> doc.count = count++ )
    res.render('products/viewProducts', { products })
  })
}

// get Product update page
exports.getProductUpdatePage = async(req, res)=>{
  let product = await Product.findOne({ _id: req.params._id }).populate('relatedProducts').populate('features.label').populate('category').populate('subcategory')
  let specifications = await Specification.find({enabled:true})
  let discount = await Discount.find({type:"product"})
  let cat = product.category
  let sub = product.subcategory
  let motherboard = false
  let ram = false
  if(cat.name === 'DESKTOP COMPONENT' || cat.name === 'Desktop Component' || cat.name === 'Desktop component'){
    if(sub.name === 'Motherboard' || sub.name === 'motherboard' || sub.name === 'MOTHERBOARD' ){
      motherboard = true
    }
    if(sub.name === 'RAM' || sub.name === 'ram' || sub.name === 'Desktop RAM' || sub.name === 'DESKTOP RAM' ){
      ram = true
    }
  }
  let pro = await Product.find()


  res.render('products/update',{ product, feature_total: product.features.length, specifications, motherboard, ram, discount, Product:pro})
  

  
}


// saving product for dealer products
exports.SaveProductDealer = async(req, res)=>{
  var data = req.body.data
  await Product.update({ _id: data._id },{ $set: data },{ upsert: true })
  res.send({})
}


// saving product for local purchase products
exports.SaveProductLP = async(req, res)=>{
  var data = req.body.data
  await Product.update({ _id: data._id },{ $set: data },{ upsert: true })
  await Serial.insertMany(req.body.serials)
  res.send({})
}


// updating product for local purchase products
exports.updateProduct = async(req, res)=>{
  var data = req.body.data
  await Product.update({ _id: data._id },{ $set: data },{ upsert: true })
  res.send({})
}


// checks whether any of the given serials already exists or not
exports.checkSerials = async(req, res)=>{

  var arr = req.body.serial_array
  var exists = [];
  var serials = await Serial.find({ pid: req.body.pid })
  
  serials.map( serial =>{
    if(arr.includes(serial.number)){
      exists.push(serial.number)
    }
  })
  
  res.send({ exists })
}


// saves image in folder
exports.SaveImage3 = async (req, res) => {

  await req.files.map(async image =>{
    var link = `https://ecom-admin.herokuapp.com/image/${image.filename}`
    await Product.update({ _id: req.body.pid },{ $addToSet: { image: link } },{ upsert: true })
  })
  res.redirect(`/products/Update/${req.body.pid}#IMAGES1`)
}

// delete image url from product 
exports.deteteImg = (req, res)=>{
  filename = req.body.img.split('image/')[1];
  
  Product.updateOne({ _id: req.body.id }, { $pull: { image: req.body.img }},{ upsert: true }, ( err, docs )=>{
    if(err) console.log(err);
    else {
      gfs.remove({ filename }, (err) => {
        res.redirect( `/products/Update/${req.body.id}#IMAGES1` )
      })
    }
  })
}


// In-house stock product entry page
exports.getInhouseInventoryPage =async (req, res) => {
  let localPurchase = await LocalPurchase.find()
  res.render('products/InhouseStockProduct',{ LocalPurchase: localPurchase });
}

// dealer stock product entry page
exports.getDealerInventoryPage =async (req, res) =>{
  let cat = await Category.find()
  let categories = await SubCategory.find()
  let brand = await Brand.find()
  res.render('products/dealerProduct',{cat, categories, brand})
} 


// shows the number of fields user wants
exports.showProductRegistrationFields =async (req, res, next) => {
  var category= req.body.categg.split(',')
  var brand= req.body.brandg.split(',')
  var model= req.body.model
  await Category.updateOne({_id: category[0]}, {$addToSet:{ brands: brand[0]} },{ upsert: true })
  var product = {
    category: category[0],
    brand: brand[0],
    model: model,
  }
  var obj={
      category: category[0],
      brand: brand[0]
  }
  // if there is no sub category of that category
  if(req.body.subCategg != '0'){
    var subcategory= req.body.subCategg.split(',');
    await SubCategory.updateOne({_id: subcategory[0]}, { $addToSet:{ brands: brand[0]} },{ upsert: true })
    product.subcategory = subcategory[0],
    product.productName = category[1]+'-'+subcategory[1]+'-'+brand[1]+'-'+model
    product.pid = category[1].substr(0,2)+brand[1].substr(0,2)
    obj.subcategory = subcategory[0]
  }else{
    product.productName = category[1]+'-'+ brand[1]+'-'+ model
    product.pid = category[1].substr(0,2)+ brand[1].substr(0,2)
  }
  
  // get all the features of cat sub and brand
  Product.find(obj, function(err, pros){
      var features = []
      if(!pros){
        pros.map( (product)=>{
          product.features.map((feature)=>{
            features.push(feature.label);
          })
        })
      }
    // checks whether the model already exists or not
    Product.findOne({ model: model }, ( err, result )=>{
      if( !result ){
        new Product( product ).save().then( product => res.render('products/dealerProduct',{ product, features, feature_total: features.length }))
      }
      else { 
        req.flash('error_msg', 'The product already exists!')
        res.render('products/dealerProduct') }
    })
  })
};

var changeStatus = (condition,  object, res, cb) => {
    Product.update(condition,{ $set: object },{ upsert: true }, function(err, docs) {
        if (err) console.log(err)
        cb(docs)
      }
    )
  }

//find fuction from product collection
var find = (obj, cb) => {
  Product.find(obj).populate("brand").populate("admin").populate("subcategory").populate("category").exec(function(err, docs) { cb(docs); });
};

// returns Edit page from product info
exports.getEditpage = (req, res, next) => {
  find({ _id: mongo.ObjectID(req.params.id) }, (docs)=>{
    res.render('products/update', {
      title: 'Update Product',
      product: docs[0],
      num_feature: docs[0].features.length
    });
  })
};

// returns product offline stock
exports.makeNotActive = (req, res) => {
  console.log(req.params.id)
  var obj = { isActive: false }
  changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  })
}

// makes product online
exports.makeActive = (req, res) => {
  var obj = { isActive: true }
  changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  })
}

// make product available
exports.makeAvailable = (req, res)=>{
  console.log(req.params.id)
  var obj = { availablity: true }
  changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  })
}

exports.getSerials = (req, res)=>{
  Serial.find()
  .populate('pid')
  .populate('lp')
  .populate('invoice')
  .exec((err, serials)=>{
    
    var count = 1;
    serials.map( doc=>
      {
        if(doc.status == 'Delivered'){
          console.log(doc)
        }
        doc.count = count++
      }  )
    res.render('products/allSerials', { serials })
  })
}

// show all the products and their quantity with low stock
exports.viewLowQuantityProducts = async (req, res)=>{
 
  var products = await Product.find()
  var serials = []
  var count = 1;
  for(var i = 0; i< products.length;i++){
    var data = await Serial.find({ $and: [{pid: products[i]._id },{status:'In Stock' }]}).populate('pid').populate('lp').populate('invoice')
    
    if(data.length < 5){
      var obj = {
        product:products[i],
        quantity: data.length,
        count: count
      }
      serials.push(obj)
      count++
    } 
  }
  res.render('products/LowInStock', { serials })
}

// make product not available
exports.makeNotAvailable = (req, res)=>{
  console.log(req.params.id)
  var obj = { availablity: false }
  changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  });
}

// get inventory list by filter
var get_all_inventory_list = (condition, sort_obj, cb) => {
  Inventory.find(condition).sort(sort_obj).populate("product_id").populate("admin").exec((err, rs)=>{ cb(rs); });
};

// check availability
exports.check_availablity= (req, res, next) => {
  var pre_arr='';
  get_all_inventory_list({product_id:req.params.model},{},(rs)=>{
    if(rs !=null){
      rs.map((inventory)=>{
        var ser=inventory.serial;
        for(var i=0;i<ser.length;i++){
          pre_arr += ser[i]
          if(i <ser.length-1){
            pre_arr +=','
          }
        }
      })
      res.json({data:pre_arr});
    }
  })
}



// exports.getSearchResult = (req, res)=>{
//    var search =  new RegExp(req.body.searchData, 'i')
//    var data =[];
//    Inventory.find()
//   .populate({
//     path:'product_id',
//     match: { 
//       $or:[
//       {'title': { $regex: search }} ,
//       {'model': { $regex: search }} ,
//       {'description': { $regex: search }},
//       {'warranty': { $regex: search }},
//       {'weight': { $regex: search }},
//       {'features.value': { $regex: search }}
//     ]
//   }})
//   .exec((err, docs)=>{
//     if(docs){
//       docs.map((items)=>{
//         if(items.product_id != null){
//           data.push(items);
//         }
//       })
//       allFuctions.live_wise_inventory(data, (rs)=>{
//       allFuctions.get_allProduct_page(res, rs, 'Inventories')
//       })
//     }
//   })
// }



// // Total stock and live info of a product
// exports.stockInfo = (req, res) => {
//   Product.findOne({ _id: req.params.id },(err, docs)=>{

//     docs.invtry = []
//     docs.total_stock = 0
//     docs.total = docs.live.quantity

//     Inventory.find({ product_id: req.params.id }, (err2, inv)=>{
//       inv.map((inven)=>{
//         docs.invtry.push(inven)
//         docs.total_stock +=inven.remaining
//         docs.total += inven.remaining
//       })
//       res.render('viewSerial', {product:docs})
//     })
//   })
// };

// // updateing stock quantity and price of prducts with no serial
// exports.stockEditNoSerial =(req, res) => {
//   var pre_Q = parseInt(req.body.pre_all_Q)
//   var quan = parseInt(req.body.quantity)
//   var obj ={
//     purchasePrice:req.body.purchase_price,
//     remaining: req.body.quantity,
//     stockQuantity :req.body.quantity
//   }
//   if( quan > pre_Q ){
//     quantity = quan-pre_Q;
//     var new_s=[]
//     for( var i=0; i<quantity; i++ ){
//       new_s.push((mongoose.Types.ObjectId()).toString())
//     }
    
//     Inventory.update({ _id: req.params.lot },{ $addToSet: { serial: { $each: new_s }, original_serial: { $each: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
//       if(err){
//         res.send(err)
//       }else{
//         res.redirect('/products/stockEditNoSerialPage/'+req.params.lot+'/'+req.params.pid)
//       }
//     })
//   }
//   if( quan < pre_Q ){
//     quantity = pre_Q-quan
//     var new_s=[]
//     Inventory.find({ _id: req.params.lot },(eer, rs)=>{
//       for(var i=0; i<quantity; i++){
//         new_s.push((rs[0].serial[i]).toString());
//       }
      
//       Inventory.update({_id:req.params.lot},{ $pull: { serial: { $in: new_s }, original_serial: { $in: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
//         if(err) res.send(err)
//         else res.redirect('/products/stockEditNoSerialPage/'+req.params.lot+'/'+req.params.pid)
//       })
//     })
//   }
// }


// // getting product models by Category
// exports.getProductByCat = (req, res, next)=>{
//   find({category: req.params.cat},(rs)=>{
//     res.render('addNewLot', {product:rs})
//   })
// };

// // getting product models by Sub category
// exports.getProductBySubcat = (req, res, next)=>{
//   find({subcategory: req.params.sub_cat},(rs)=>{
//     res.render('addNewLot', {product:rs})
//   })
// }




// // edit Purchase Price of inventory with serial
// exports.EditPP = (req, res, next)=>{
//   Inventory.update({ _id: req.params.lot_id },{ $set:{ purchasePrice: req.body.PP } }, { upsert: true }, (err,rs)=>{
//     if(err){
//       res.send(err)
//     }else{
//       res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
//     }
//   })
// }

// // Delete One serial
// exports.EditDelete = (req, res, next)=>{
//   Inventory.update({_id: req.params.lot_id },
//     {
//       $pull:{
//         original_serial: req.body.pre_serial_del, 
//         serial:req.body.pre_serial_del
//       },
//       $inc:{ remaining:-1 } 
//     }, { upsert:true }, (err,rs)=>{
//       if(err){
//         res.send(err)
//       }else{
//         res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
//       }
//   })
// }

// // replace one serial number from inventory
// exports.EditReplace = (req, res, next)=>{
//   if(req.body.msg_err1 === 'No'){
//   Inventory.update({_id: req.params.lot_id },{$addToSet:{original_serial:req.body.replace_serial, serial:req.body.replace_serial}}, 
//     {upsert:true}, (err,rs)=>{
//       if(err) res.send(err) 
//       else {
//         Inventory.update({_id: req.params.lot_id },{$pull:{original_serial: req.body.pre_serial, serial:req.body.pre_serial}}, 
//           {upsert:true}, (err,rs)=>{
//           if(err){ res.send(err); }
//           else{
//             res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
//           }
//         })
//       }
//     })
//   }
//   else{
//     req.flash('error_msg', 'Given serial number already exists!')
//     res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
//   }
// };

// // getting product models by Sub category
// exports.getProductBySub_filter = (req, res, next)=>{
//   Inventory.find({})
//   .populate({
//     path:'product_id',
//     match:{'subcategory': req.params.sub_cat}
//   })
//   .exec((err, rs)=>{
//     var data = []
//     rs.map((inven)=>{
//       if(inven.product_id != null){
//         data.push(inven)
//       } 
//     })
//     allFuctions.live_wise_inventory(data, (docs)=>{
//       allFuctions.get_allProduct_page(res, docs, 'Sub Category')
//     })
//   })
// };

// // getting product models by Sub category
// exports.getProductByCat_filter = (req, res, next)=>{
//   Inventory.find({})
//   .populate({
//     path:'product_id',
//     match:{'category': req.params.cat}
//   })
//   .exec((err, rs)=>{
//     var data = []
//     rs.map((inven)=>{
//       if(inven.product_id != null){
//         data.push(inven)
//       } 
//     })
//     allFuctions.live_wise_inventory(data, (docs)=>{
//       allFuctions.get_allProduct_page(res, docs, 'Category')
//     })
//   })
// };

// // getting product models by Category
// exports.getProductByCatNoSerial = (req, res, next)=>{
//   find({category: req.params.cat},(rs)=>{
//     res.render('addNewLotNoSerial', {product:rs})
//   })
// };








// // get lot without serial page
// exports.saveInventoryNoSerial= (req, res, next) => {
//   var quantity = parseInt(req.body.quantity);
//   var serials= [];
//   for(var i=0; i<quantity; i++){
//     serials.push((mongoose.Types.ObjectId()).toString())
//   }
//   var inventory = {
//     product_id: req.body.model,
//     stockQuantity: req.body.quantity,
//     purchasePrice: req.body.purchase_price,
//     remaining: req.body.quantity,
//     admin: req.user._id,
//     original_serial: serials,
//     serial: serials
//   }
//   Product.update({_id:req.body.model}, { $set:{ warranted: false } },{ upsert:true }, (err, rs)=>{
//     if(err){
//       console.log(err)
//     }else{
//       new Inventory(inventory).save().then(inventory => {
//         res.redirect("/products/saveInventoryNoSerialPage");
//       });
//     }
//   })
// };

// // Save Inventory
// exports.saveInventory = (req, res, next) => {
//   var serials= (req.body.serial).split(",");
//   var inventory = {
//     product_id:req.body.model,
//     stockQuantity:req.body.quantity,
//     purchasePrice: req.body.purchase_price,
//     remaining: req.body.quantity,
//     serial: serials,
//     original_serial:serials,
//     admin: req.user._id
//   }
//   Product.update({_id:req.body.model}, { $set:{ warranted: true } },{ upsert:true }, (err, rs)=>{
//     if(err){
//       console.log((err))
//     }else{
//       new Inventory(inventory).save().then(inventory => {
//         res.json({})
//       });
//     }
//   }) 
// };

// const multer = require("multer");
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const mongoo = 'mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db';

// const conn = mongoose.createConnection(mongoo);
// let gfs;
// conn.once('open', function () {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('fs');
// })
// var filename;
// // create storage engine
// const storage = new GridFsStorage(
//   {
//     url: mongoo,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) { return reject(err); }
//           filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'fs'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
// const upload = multer({ storage });
// 892
// // single product view
// exports.singleProduct = (req, res) => {
//   Product.find({_id:req.params.id})
//     .populate("brand")
//     .populate("admin")
//     .populate("subcategory")
//     .populate("category")
//     // .populate({
//     //   path: "subcategory",
//     //   populate: { path: "category" }
//     // })
//     .exec(function(err, product) {
//       console.log("DFGDF")
//       console.log(err)
//       var obj = resultArray.features;
//       res.render("single", {
//         title: "Single",
//         product: product,
//         features: obj
//       });
//     });
// };



// exports.addLotPage= (req, res, next) => {
//   res.render("addNewLot");
// };

// // returns setDiscount to the selected product
// exports.addDiscount = (req, res, next)=>{
  
//   allFuctions.find({_id: req.params.id}, function(rs){

//     var listPrice = rs[0].productPrice.listPrice;
//     var with_discount = listPrice-((req.body.discount/100)*listPrice);

//     if(with_discount <= rs[0].productPrice.wholeSalePrice ){

//       req.flash('error_msg', "Discounted price is less than the wholesale price!");
//       var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true};
//       changeStatus(req, res, obj);
//       res.redirect('/products/view');

//     }else{
//       var obj = {'productPrice.salePrice': Number((with_discount).toFixed(0)), onSale:true };
//       changeStatus(req, res, obj);
//       res.redirect('/products/view');
//     }
//   })
// }

// // function for updateting category table
// function update_category(condition, values, cb){
//   Category.update(condition,values,{ upsert: true },function(err, docs){
//       if(err){ console.log(err)}
//     }
//   ) 
// }
// function update_subcategory(condition, values, cb){
//   Category.update(condition,values,{ upsert: true },function(err, docs){
//       if(err){ console.log(err)}
//     }
//   ) 
// }

// // adds to the sale list
// exports.makeOnSale = (req, res, next) => {

//   var obj = { onSale: true };
//   changeStatus(req, res, obj);
//   res.redirect("/products/Online/" + req.params.cid);

// };

// // returns Remove product sale
// exports.removeFromSale = (req, res, next) => {

//   var obj = { 
//     onSale: false,
//     'productPrice.salePrice': null
//   };
//   changeStatus(req, res, obj);
//   res.redirect("/products/view");
// };





// // delete product
// exports.deleteProduct = (req, res, next) => {
//   Product.deleteOne({ _id: mongo.ObjectID(req.params.id) }, function(err,bear) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.redirect("/products/view");
//     }
//   });
// };

// returns all product with stock info page
// exports.getAllProductStock = (req, res, next) => {

//   var resultArray = [];
//   Product.find()
//   .sort({ "quantity.stock": -1 })
//   .populate("subcategory")
//   .populate("quantity.userID")
//   .exec(function(err, docs) {
//     if (err) {
//       res.send(err);
//     } else {
//       for (var i = docs.length - 1; i > -1; i -= 1) {
//         resultArray.push(docs[i]);
//       }
//     }
//     res.render("stock", {
//       title: "Stock",
//       products: resultArray
//     });
//   });

// };

