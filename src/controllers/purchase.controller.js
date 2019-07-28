const LP = require('../models/localPurchase.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');
const Serials = require('../models/serials.model');

// get supplier registration page
exports.LocalPurchasePage = (req, res) => { 
  var today = new Date()
  var date =(today.getMonth()+1) +' / '+today.getDate()+' / '+ today.getFullYear();
  console.log(date)
  res.render('purchase/localPurchase',{ date });
}

exports.productList = async (req, res)=>{
  var lp = await LP.findOne({_id: req.params._id}).populate('products.product')
 
  res.render('purchase/productList', { products: lp.products })
}

// get supplier registration page
exports.getLPList = async (req, res) =>{
  var lp = await LP.find().populate('supplier').sort({ "date": -1 })
  var count = 1;
  lp.map( doc=> doc.count = count++ )
  res.render('purchase/allPurchase', { lp })
} 

// fetching products of a specific local purchase 
exports.getProducts = (req, res) => {

  LP.findOne({ _id: req.params.invc })
    .populate('products.product')
    .populate({
      path: 'products.product',
      populate: { path: 'category' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'brand' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'subcategory' },
    })
    .populate('supplier')
    // .exec((err, doc) => res.send(doc))
    .exec(async (err, doc) => 
    {
     
      var doc_serial = { lp: doc, serials: [] }
      
      for(var i=0; i< doc.products.length; i++){
        var docs = await Serials.find({ pid: doc.products[i].product._id })
        doc_serial.serials.splice(doc_serial.serials.length-1, 0, ...docs)
       
          // doc_serial.serials.push(docs)
        
      }
      res.send(doc_serial)
    })
};

// get supplier registration page
exports.LocalPurchaseLPPage = (req, res) => {

  LP.findOne({ number: req.params.invc })
    .populate('products.product')
    .populate({
      path: 'products.product',
      populate: { path: 'category' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'brand' }
    })
    .populate({
      path: 'products.product',
      populate: { path: 'subcategory' }
    })
    .populate('supplier')
    .exec((err, doc) => {

      var count = 1;

      for (var i = 0; i < doc.products.length; i++) {
        doc.products[i].num = count;
        count++;
      }

      res.render('purchase/localPurchase', { lp: doc });
    });
};

// saves local purchase
exports.SaveLocalPurchase = async (req, res) => {
  const { model1, contt, number, quantity, purchasePrice, cattN, subNn, brandN, serial_availablity } = req.body;
  var contact = contt.split(',')
  var total = Number(quantity) * Number(purchasePrice)
  var brand = (brandN).split(',')
  
  // fetching sub, cat, brand and product
  var cat = (cattN).split(',')
  if(subNn != '0'){
    var sub = (subNn).split(',')
    await SubCategory.updateOne({_id: sub[0]}, {$addToSet:{ brands: brand[0]} },{ upsert: true })
  }
  
  await Category.updateOne({_id: cat[0]}, {$addToSet:{ brands: brand[0]} },{ upsert: true })
  
  var pro = await Product.findOne({ model: model1 });
  var lp = await LP.findOne({ number });


  // if the fetched product is null insert the product
  if (pro === null) {
    var pro_obj = {
      model: model1,
      category: cat[0],
      brand: brand[0],
      
    };
    if (serial_availablity === 'on') {
      pro_obj.serial_availablity = true
    }else{
      pro_obj.serial_availablity = false
    }
    if (subNn != '0') {
      pro_obj.subcategory = sub[0]; 
      pro_obj.productName = `${cat[1]}-${sub[1]}-${brand[1]}-${model1}`;
      pro_obj.pid = cat[1].slice(0,3)+ sub[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    else{
      pro_obj.productName = `${cat[1]}-${brand[1]}-${model1}`
      pro_obj.pid = cat[1].slice(0,3)+ brand[1].slice(0,3)+ model1
    }
    pro = await new Product(pro_obj).save();
  }

  var product = { product: pro._id, quantity, purchasePrice, total }

  // if localpurchase doesn't exist then insert 
  // else insert newly added product and update subtotal 
  if (lp === null) {
    var obj = req.body;
    obj.contactPerson= contact[0]
    obj.mobile= contact[1]
    obj.products= [ product ], 
    obj.subTotal= total
    
    await new LP(obj).save();
  } else {
    await LP.update({ number },
      { 
        $addToSet: { products: product },
        $inc: { subTotal: +total }
      }, { upsert: true });
  }
  res.redirect(`/purchase/localPurchase/${number}`);
};
