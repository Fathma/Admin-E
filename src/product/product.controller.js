// author : fathma Siddique
// lastmodified : 11/6/2019
// description : all the product related controllers/funtions are written in here 

//Imports
var mongo = require('mongodb')
const Product = require('./Product')
const Category = require('../parents/category.model')
const SubCategory = require('../parents/subCategory.model')
const Inventory = require('../../models/inventory.model')
const Serial = require('./serials.model')
const allFuctions = require('../helpers/allFuctions')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const app = require('../../app')
const key= require('../../config/keys')

mongoose.Promise = global.Promise;

// const mongoo = 'mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1';

const conn = mongoose.createConnection(key.database.mongoURI);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
})

exports.relatedProducts =async (req, res)=>{
  let _id = req.body.pid;
  let prod = await Product.findOne({_id})
  if(prod.relatedProducts.includes(req.body.relatedProducts)){
    let product = await Product.findOne({_id}).populate('relatedProducts')
    res.render('products/InhouseStockProduct', { product })
  }else{
    prod.relatedProducts.push(req.body.relatedProducts)
    new Product(prod).save().then(async (pro)=>{
      let product = await Product.findOne({_id}).populate('relatedProducts')
      res.render('products/InhouseStockProduct', { product, active:true })
    })
  }
}
exports.relatedProducts1 =async (req, res)=>{
  let _id = req.body.pid;
  let prod = await Product.findOne({_id})
  if(prod.relatedProducts.includes(req.body.relatedProducts)){
    res.redirect('/products/Update/'+_id)
  }else{
    prod.relatedProducts.push(req.body.relatedProducts)
    new Product(prod).save().then(async (pro)=>{
      res.redirect('/products/Update/'+_id)
    })
  }
}

async function delete_related (req){
  var product = await Product.findOne({ _id: req.params.pid })
  
  var el = product.relatedProducts.filter((ele)=>{
    return ele != req.params.rid
  })
  product.relatedProducts = el
  new Product(product).save()
}

exports.relatedProductsDelete = async(req, res)=>{
  delete_related (req)
  var product1 = await Product.findOne({ _id: req.params.pid }).populate('relatedProducts')
  res.render('products/InhouseStockProduct', { product:product1, active:true })
}
 

exports.relatedProductsDelete1 = async(req, res)=>{
  delete_related (req)
    
    res.redirect('/products/Update/'+req.params.pid)
  
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
  let product = await Product.findOne({ _id: req.params._id }).populate('relatedProducts')
  res.render('products/update',{ product, feature_total: product.features.length })
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
exports.SaveImage = async (req, res) => {
  // await savingImage(req)
  var product = await Product.findOne({ _id:req.body.pid }).populate('relatedProducts')
  res.render('products/InhouseStockProduct', { product })
  // res.redirect('/products/InhouseInventory')
}
// saves image in folder
exports.SaveImage2 = async (req, res) => {
  await savingImage(req)
  res.redirect('/products/DealerInventory')
}

// saves image in folder
exports.SaveImage3 = async (req, res) => {
  await savingImage(req)
  res.redirect(`/products/Update/${req.body.pid}`)
}

// delete image url from product 
exports.deteteImg = (req, res)=>{
  filename = req.body.img.split('image/')[1];
  
  Product.updateOne({ _id: req.body.id }, { $pull: { image: req.body.img }},{ upsert: true }, ( err, docs )=>{
    if(err) console.log(err);
    else {
      
      gfs.remove({ filename }, (err) => {
        res.redirect( `/products/Update/${req.body.id}` )
      })
    }
  })
}

// saves link with image filenames in database
var savingImage = async req =>{
  await req.files.map(async image =>{
    var link = `https://ecom-admin.herokuapp.com/image/${image.filename}`
    await Product.update({ _id: req.body.pid },{ $addToSet: { image: link } },{ upsert: true })
  })
}



// In-house stock product entry page
exports.getInhouseInventoryPage = (req, res) => res.render('products/InhouseStockProduct');

// dealer stock product entry page
exports.getDealerInventoryPage = (req, res) => res.render('products/dealerProduct');

// shows the number of fields user wants
exports.showProductRegistrationFields =async (req, res, next) => {
  var category= req.body.categg.split(',');
  var brand= req.body.brandg.split(',');
  var model= req.body.model;
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
    product.subcategory= subcategory[0],
    product.productName = category[1]+'-'+subcategory[1]+'-'+brand[1]+'-'+model
    product.pid= category[1].substr(0,3)+subcategory[1].substr(0,3)+brand[1].substr(0,3)+model
    obj.subcategory=subcategory[0]
  }else{
    product.productName = category[1]+'-'+brand[1]+'-'+model
    product.pid = category[1].substr(0,3)+brand[1].substr(0,3)+model
  }
  
  // get all the features of cat sub and brand
  Product.find(obj, function(err, pros){
      var features = []
      if(pros != null){
        pros.map( (product)=>{
          product.features.map((feature)=>{
            features.push(feature.label);
          })
        })
      }
    // checks whether the model already exists or not
    Product.findOne({ model: model }, ( err, result )=>{
      if( result === null ){
        new Product( product ).save().then( product => res.render('products/dealerProduct',{ product, features, feature_total: features.length }))
      }
      else res.render('products/dealerProduct',{ product: result, features, feature_total: features.length })
    })
  })
};


// // get live stock edit page
// exports.getLiveStockEditpage = async (req, res) => {
//   var arr=[]
//   var rs = await allFuctions.get_inventory_list_new({product_id:req.params.pid},{},'product_id')
 
//   rs.map((inventory)=>{
//     arr.push(inventory.purchasePrice);
//   })
//   await arr.sort();
//   var docs = await allFuctions.get_inventory_list_new({_id:req.params.id},{},'product_id')

//   res.render('updateLiveStock', {
//       title: 'Update Live',
//       inventory: docs[0],
//       highest_pp: arr[arr.length-1]
//     });
// };

// // get live stock edit page
// exports.RestoreLiveNoserialPage = async (req, res) => {
//   let docs = await allFuctions.get_live({_id:req.params.id});
//   res.render('liveToInventoryNoSerial', {
//     title: 'Restore live serial',
//     live: docs[0]
//   });
// };

// // get live stock edit page
// exports.getRestoreLivepage = async (req, res) => {
//   let docs = await allFuctions.get_live({_id:req.params.id});
//   res.render('liveToInventory', {
//     title: 'Restore live serial',
//     live: docs[0]
//   });
// };

// // this is to get selected serials and restore them in inventory and update the remaining live quantity 
// exports.getRestoreLive =async (req, res) => {
//   var live_serials=(req.body.serial).split(',');
//   var product_update_serial = []
//   await Product.findOne({_id:req.params.id}, async (err, docs)=>{
//     await docs.live.serial.map((obj)=>{
//       live_serials.map(async (selected)=>{
//         if(obj.serial === selected){
//           product_update_serial.push(obj);
//           await Inventory.update({_id:obj.inventory},{ $addToSet:{ serial: selected}, $inc:{'remaining': +1}},{upsert:true} )
//           await Product.findOneAndUpdate({_id: req.params.id}, { $pull: { 'live.serial': obj },
//           $inc:{'frontQuantity': -1, 'live.quantity': -1}},{upsert:true})
//         }
//       })
//     })
//   })
//   res.redirect('/products/RestoreLivepage/'+req.params.id);
// };

// // get inventory list high to low
// exports.StockHighToLow = (req, res) => {
//   allFuctions.get_all_inventory_list({},{ 'remaining': -1 }, (docs)=>{
//     docs.total_stock = 0;
//     docs.map((inventory)=>{
//       if(inventory.product_id){
//         var count = 0;
//         inventory.product_id.live.serial.map((serial)=>{
//           if((inventory._id).toString() === (serial.inventory).toString()) count++;
//         })
//         inventory.count = count;
//       }
//     })
//     allFuctions.get_allProduct_page(res, docs)
//   })
// };

// // get inventory list low to high
// exports.StockLowToHigh= (req, res) => {
//   allFuctions.get_all_inventory_list({},{ 'remaining': 1 }, (docs)=>{
//    allFuctions.live_wise_inventory(docs, (rs)=>{
//      allFuctions.get_allProduct_page(res, rs, 'Inventories')
//    })
//   })
// };

exports.getSearchResult = (req, res)=>{
   var search =  new RegExp(req.body.searchData, 'i')
   var data =[];
   Inventory.find()
  .populate({
    path:'product_id',
    match: { 
      $or:[
      {'title': { $regex: search }} ,
      {'model': { $regex: search }} ,
      {'description': { $regex: search }},
      {'warranty': { $regex: search }},
      {'weight': { $regex: search }},
      {'features.value': { $regex: search }}
    ]
  }})
  .exec((err, docs)=>{
    if(docs){
      docs.map((items)=>{
        if(items.product_id != null){
          data.push(items);
        }
      })
      allFuctions.live_wise_inventory(data, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, 'Inventories')
      })
    }
  })
}

// returns allproduct page
exports.getAllProducts = (req, res) => {
  allFuctions.get_all_inventory_list({},{'product_id': 1 }, (docs)=>{
    allFuctions.live_wise_inventory(docs, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, 'Inventories')
    })
  })
};

// Total stock and live info of a product
exports.stockInfo = (req, res) => {
  Product.findOne({ _id: req.params.id },(err, docs)=>{

    docs.invtry = []
    docs.total_stock = 0
    docs.total = docs.live.quantity

    Inventory.find({ product_id: req.params.id }, (err2, inv)=>{
      inv.map((inven)=>{
        docs.invtry.push(inven)
        docs.total_stock +=inven.remaining
        docs.total += inven.remaining
      })
      res.render('viewSerial', {product:docs})
    })
  })
};

// returns Edit page from product info
exports.getEditpage = (req, res, next) => {
  allFuctions.find({ _id: mongo.ObjectID(req.params.id) }, (docs)=>{
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
  allFuctions.changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  })
}

// makes product online
exports.makeActive = (req, res) => {
  var obj = { isActive: true }
  allFuctions.changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  })
}

// make product available
exports.makeAvailable = (req, res)=>{
  console.log(req.params.id)
  var obj = { availablity: true }
  allFuctions.changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
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

exports.viewLowQuantityProducts = async (req, res)=>{
  var products = await Product.find()
  var serials = []
  for(var i = 0; i< products.length;i++){
    var data = await Serial.find({ $and: [{pid: products[i]._id },{status:'In Stock' }]}).populate('pid').populate('lp').populate('invoice')
    var count = 1;
    data.map( doc=> doc.count = count++ )
    if(data.length < 5) serials.push(...data)
  }
  res.render('products/allSerials', { serials })
  
}

// make product not available
exports.makeNotAvailable = (req, res)=>{
  console.log(req.params.id)
  var obj = { availablity: false }
  allFuctions.changeStatus({ _id: req.params.id }, obj, res, (docs)=>{
    res.redirect('/products/viewProducts')
  });
}

// updateing stock quantity and price of prducts with no serial
exports.stockEditNoSerial =(req, res) => {
  var pre_Q = parseInt(req.body.pre_all_Q)
  var quan = parseInt(req.body.quantity)
  var obj ={
    purchasePrice:req.body.purchase_price,
    remaining: req.body.quantity,
    stockQuantity :req.body.quantity
  }
  if( quan > pre_Q ){
    quantity = quan-pre_Q;
    var new_s=[]
    for( var i=0; i<quantity; i++ ){
      new_s.push((mongoose.Types.ObjectId()).toString())
    }
    
    Inventory.update({ _id: req.params.lot },{ $addToSet: { serial: { $each: new_s }, original_serial: { $each: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
      if(err){
        res.send(err)
      }else{
        res.redirect('/products/stockEditNoSerialPage/'+req.params.lot+'/'+req.params.pid)
      }
    })
  }
  if( quan < pre_Q ){
    quantity = pre_Q-quan
    var new_s=[]
    Inventory.find({ _id: req.params.lot },(eer, rs)=>{
      for(var i=0; i<quantity; i++){
        new_s.push((rs[0].serial[i]).toString());
      }
      
      Inventory.update({_id:req.params.lot},{ $pull: { serial: { $in: new_s }, original_serial: { $in: new_s }},$set:obj },{upsert:true}, (err, docs)=>{
        if(err) res.send(err)
        else res.redirect('/products/stockEditNoSerialPage/'+req.params.lot+'/'+req.params.pid)
      })
    })
  }
}

// returns Edit stock page
exports.stockEditNoSerialPage =async (req, res, next) => {
  try {
    let docs = await allFuctions.get_inventory_list_new({ _id: req.params.lot }, {}, 'product_id');
    res.render('editStockInfoNoSerial', {
      title: 'Update Stock Info',
      product: docs[0]
    });
  } catch (error) {
    res.send(error)
  }
};

// returns Edit stock page
exports.getEditStockPage =async (req, res, next) => {
  let docs = await allFuctions.get_inventory_list_new({ _id: req.params.lot_id }, {}, 'product_id')
  var serial_string=''
  for(var i=0; i<docs[0].serial.length; i++){
    serial_string += docs[0].serial[i]
    if(i != docs[0].serial.length -1){
      serial_string += ','
    }
  }
  let rs = await  allFuctions.get_inventory_list_new({product_id: req.params.pid }, {}, 'product_id') 
  var all_serials = ''
  rs.map((lot)=>{
    if(lot._id === req.params.lot_id){}
    else{
      for(var j=0; j< lot.original_serial.length; j++){
        all_serials += lot.original_serial[j]
        if(j != lot.original_serial.length -1){
          all_serials += ','
        }
      }
    }
  })
  res.render('editStockInfo', {
    title: 'Update Stock Info',
    product: docs[0],
    serial_string: serial_string,
    original_serial:all_serials,
  });
};

// edit Purchase Price of inventory with serial
exports.EditPP = (req, res, next)=>{
  Inventory.update({ _id: req.params.lot_id },{ $set:{ purchasePrice: req.body.PP } }, { upsert: true }, (err,rs)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
    }
  })
}

// Delete One serial
exports.EditDelete = (req, res, next)=>{
  Inventory.update({_id: req.params.lot_id },
    {
      $pull:{
        original_serial: req.body.pre_serial_del, 
        serial:req.body.pre_serial_del
      },
      $inc:{ remaining:-1 } 
    }, { upsert:true }, (err,rs)=>{
      if(err){
        res.send(err)
      }else{
        res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
      }
  })
}

// replace one serial number from inventory
exports.EditReplace = (req, res, next)=>{
  if(req.body.msg_err1 === 'No'){
  Inventory.update({_id: req.params.lot_id },{$addToSet:{original_serial:req.body.replace_serial, serial:req.body.replace_serial}}, 
    {upsert:true}, (err,rs)=>{
      if(err) res.send(err) 
      else {
        Inventory.update({_id: req.params.lot_id },{$pull:{original_serial: req.body.pre_serial, serial:req.body.pre_serial}}, 
          {upsert:true}, (err,rs)=>{
          if(err){ res.send(err); }
          else{
            res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
          }
        })
      }
    })
  }
  else{
    req.flash('error_msg', 'Given serial number already exists!')
    res.redirect('/products/stockEditPage/'+ req.params.lot_id+'/'+req.params.pid)
  }
};

// getting product models by Category
exports.getProductByCat = (req, res, next)=>{
  allFuctions.find({category: req.params.cat},(rs)=>{
    res.render('addNewLot', {product:rs})
  })
};

// getting product models by Sub category
exports.getProductBySubcat = (req, res, next)=>{
  allFuctions.find({subcategory: req.params.sub_cat},(rs)=>{
    res.render('addNewLot', {product:rs})
  })
};

// getting product models by Sub category
exports.getProductBySub_filter = (req, res, next)=>{
  Inventory.find({})
  .populate({
    path:'product_id',
    match:{'subcategory': req.params.sub_cat}
  })
  .exec((err, rs)=>{
    var data = []
    rs.map((inven)=>{
      if(inven.product_id != null){
        data.push(inven)
      } 
    })
    allFuctions.live_wise_inventory(data, (docs)=>{
      allFuctions.get_allProduct_page(res, docs, 'Sub Category')
    })
  })
};

// getting product models by Sub category
exports.getProductByCat_filter = (req, res, next)=>{
  Inventory.find({})
  .populate({
    path:'product_id',
    match:{'category': req.params.cat}
  })
  .exec((err, rs)=>{
    var data = []
    rs.map((inven)=>{
      if(inven.product_id != null){
        data.push(inven)
      } 
    })
    allFuctions.live_wise_inventory(data, (docs)=>{
      allFuctions.get_allProduct_page(res, docs, 'Category')
    })
  })
};

// getting product models by Category
exports.getProductByCatNoSerial = (req, res, next)=>{
  allFuctions.find({category: req.params.cat},(rs)=>{
    res.render('addNewLotNoSerial', {product:rs})
  })
};

// getting product models by Sub category
exports.getProductBySubcatNoSerial = (req, res, next)=>{
  allFuctions.find({subcategory: req.params.sub_cat},(rs)=>{
    res.render('addNewLotNoSerial', {product:rs})
  })
};

// adding new serial during edit lot
exports.editAddNew = (req, res, next) => {
  var new_serial = req.body.new_serial;
  var lot_id = req.params.lot_id;
  var pid = req.params.pid; 
  var addToSet_obj = { serial: new_serial, original_serial: new_serial};
  var inc_obj = { stockQuantity: 1, remaining: 1 };

  if(req.body.msg_err === 'No'){
    Inventory.update({ _id: lot_id },{ $addToSet: addToSet_obj, $inc: inc_obj}, { upsert:true }, (err,docs)=>{
      if(err){ res.send(err); }
      else{
        res.redirect('/products/stockEditPage/'+ lot_id+'/'+pid)
      }
    })
  }else{
    req.flash('error_msg', 'Given serial number already exists!');
    res.redirect('/products/stockEditPage/'+ lot_id+'/'+pid)
  }
};

// returns Online Product page
exports.getOnlineProductsPage =async (req, res, next) => {
  var populate_obj = {
    path:'product_id',
    match: { isActive:true }
  };

  let docs = await allFuctions.get_inventory_list_new({},{ 'product_id': 1 },populate_obj)
    allFuctions.live_wise_inventory(docs, (rs)=>{
      allFuctions.get_allProduct_page(res, rs, 'Inventories')
  })
};

// returns Offline Product page
exports.getOfflineProductsPage =async (req, res, next) => {
  var populate_obj = {
    path:'product_id',
    match: { isActive:false }
  }
  let docs = await allFuctions.get_inventory_list_new({},{ 'product_id': 1 },populate_obj)
  allFuctions.live_wise_inventory(docs, (rs)=>{
    allFuctions.get_allProduct_page(res, rs, 'Inventories')
  }) 
}



// save live
exports.saveLive =async (req, res, next) => {
  var quantity = req.body.quantity
  var product_id = req.params.id
  var unitPrice = req.body.unit_price
  var remaining = req.body.remaining
  var serial_obj = (req.body.serial).split(',')
  var live_serial = []

  serial_obj.map((serial_no)=>{
    var obj = {
      serial: serial_no,
      inventory: req.body.lot_number
    }
    live_serial.push(obj)
  })
  var inc_ob = { frontQuantity: +quantity, 'live.quantity': +quantity }
  var set_ob = { unitPrice: unitPrice, 'live.admin': req.user._id }
  
  Product.update({_id: product_id}, { $addToSet: { 'live.serial': live_serial }, $inc: inc_ob, $set: set_ob}, {upsert:true},(err, docs)=>{
    Inventory.update({_id:req.body.lot_number}, {$pull: { serial: { $in: serial_obj } }, $set:{'remaining':(parseInt(remaining)-quantity)}},
    { upsert: true },function(err, docs){
      if(err){ res.send(err); }
      req.flash('success_msg', 'Live Product Added')
      res.redirect('/Products/liveStockEdit/'+req.body.lot_number+'/'+req.params.id)
    }) 
  })
}

// check availability
exports.check_availablity= (req, res, next) => {
  var pre_arr='';
  allFuctions.get_all_inventory_list({product_id:req.params.model},{},(rs)=>{
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

// // returns setDiscount page
// exports.addDiscountpage = (req, res, next)=>{
//   allFuctions.find({_id: req.params.id},function(rs){
//     res.render("setDiscount", {id: req.params.id, products:rs[0]});
//   })
// }

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

