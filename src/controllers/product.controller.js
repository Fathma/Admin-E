// author : fathma Siddique
// lastmodified : 31/7/2019
// description : all the product related controllers/funtions are written in here

//Imports
var mongo = require('mongodb');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const key = require('../../config/keys');

// loads all the requires models
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');
const Specification = require('../models/specification.model');
const Serial = require('../models/serials.model');
const LocalPurchase = require('../models/localPurchase.model');
const Brand = require('../models/brand.model');
const Discount = require('../models/discount.model');
const logger = require('../utils/logger');

mongoose.Promise = global.Promise;

const conn = mongoose.createConnection(key.database.mongoURI);
let gfs;
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('fs');
});

// fires the page to create new product specification
exports.SpecificationsNew = (req, res) =>
  res.render('products/newSpecification');

// fires the page if new specification need while registering a product.
// that id is to go back that specific product after adding new specification
exports.SpecificationsNewId = (req, res) => {
  res.render('products/newSpecification', { id: req.params.id });
};

// making a product disable
exports.makeDisabled = async (req, res) => {
  await Specification.update(
    { _id: req.params.sid },
    { $set: { enabled: false } }
  );
  res.redirect('/products/Specifications#' + req.params.sid);
};

// making a product enable
exports.makeEnabled = async (req, res) => {
  await Specification.update(
    { _id: req.params.sid },
    { $set: { enabled: true } }
  );
  res.redirect('/products/Specifications#' + req.params.sid);
};

// making filtering false of a specification
exports.specificationMakeFalse = async (req, res) => {
  await Specification.update(
    { _id: req.params.sid },
    { $set: { filtering: false } }
  );
  res.redirect('/products/Specifications#' + req.params.sid);
};

// making filtering false of a specification
exports.specificationMakeTrue = async (req, res) => {
  await Specification.update(
    { _id: req.params.sid },
    { $set: { filtering: true } }
  );
  res.redirect('/products/Specifications#' + req.params.sid);
};

// save new specification
exports.SpecificationsSave = (req, res) => {
  // check whether it is already exists or not
  Specification.findOne(
    { name: req.body.specification },
    (err, specifications) => {
      if (!specifications) {
        let obj = {
          name: req.body.specification,
          createdBy: req.user._id,
        };

        //  if product id exist then it will redirect to that product update page
        if (req.body.id) {
          new Specification(obj).save().then(() => {
            res.redirect(
              '/products/Update/' + req.body.id + '#SPECIFICATIONS1'
            );
          });
        } else {
          new Specification(obj).save().then(() => {
            res.redirect('/products/specifications/new');
          });
        }
      } else {
        req.flash('error_msg', 'Already exists!');
        res.redirect('/products/specifications/new');
      }
    }
  );
};

//  shows list od specification
exports.Specifications = async (req, res) => {
  var specifications = await Specification.find().populate('createdBy');
  var count = 1;
  specifications.map((doc) => (doc.count = count++));
  res.render('products/specifications', { specifications });
};

// save shipping in fo of a product
exports.shippingSave = async (req, res) => {
  let prod = await Product.findOne({ _id: req.body.pid });
  let shippingInfo = {
    weight: req.body.weight,
    height: req.body.height,
    width: req.body.width,
    length: req.body.length,
    freeShipping: req.body.freeShipping,
    additionalCharge: req.body.additionalCharge,
    deliveryDate: req.body.deliveryDate,
  };

  prod.shippingInfo = shippingInfo;

  new Product(prod).save().then(() => {
    res.redirect('/products/Update/' + req.body.pid + '#Shipping1');
  });
};

exports.SavePrice = async (req, res) => {
  if (req.body.discount == '') req.body.discount = null;
  await Product.update({ _id: req.body.pid }, { $set: req.body });
  res.redirect('/products/Update/' + req.body.pid + '#PRICE');
};

// added attribute to a product
exports.SaveAttribute = async (req, res) => {
  let prod = await Product.findOne({ _id: req.body.pid });
  let attribute = {
    label: req.body.label,
    value: req.body.value,
  };

  prod.features.push(attribute);

  new Product(prod).save().then(() => {
    res.redirect('/products/Update/' + req.body.pid + '#SPECIFICATIONS1');
  });
};

// saves homePage tags
exports.SaveHomePageTag = async (req, res) => {
  await Product.update(
    { _id: req.body.pid },
    { $set: { HomePagetag: req.body.HomePagetag } }
  );
  res.redirect('/products/Update/' + req.body.pid + '#ProductTag1');
};

// deletes an attribute from a product
exports.deleteAttribute = async (req, res) => {
  let prod = await Product.findOne({ _id: req.params._id });

  prod.features = prod.features.filter(function (feature, index, arr) {
    return feature.label.toString() !== req.params.label;
  });

  new Product(prod).save().then(() => {
    res.redirect('/products/Update/' + req.params._id + '#SPECIFICATIONS1');
  });
};

// saves related products to a product
exports.relatedProducts1 = async (req, res) => {
  let _id = req.body.pid;
  let prod = await Product.findOne({ _id });
  if (prod.relatedProducts.includes(req.body.relatedProducts)) {
    res.redirect('/products/Update/' + _id);
  } else {
    prod.relatedProducts.push(req.body.relatedProducts);
    new Product(prod).save().then(async (pro) => {
      res.redirect('/products/Update/' + _id + '#RELATED');
    });
  }
};

// deletes a related product
exports.relatedProductsDelete1 = async (req, res) => {
  // delete_related (req)
  let product = await Product.findOne({ _id: req.params.pid });

  let el = product.relatedProducts.filter((ele) => {
    return ele != req.params.rid;
  });
  product.relatedProducts = el;
  new Product(product).save().then(() => {
    res.redirect('/products/Update/' + req.params.pid + '#RELATED1');
  });
};

// viewProducts
exports.viewProducts = (req, res) => {
  Product.find()
    .sort({ created: -1 })
    .select({
      productName: 1,
      model: 1,
      sellingPrice: 1,
      isActive: 1,
      availablity: 1,
      dealer: 1,
      _id: 1,
    })
    .exec((err, products) => {
      var count = 1;
      products.map((doc) => (doc.count = count++));
      res.render('products/viewProducts', { products });
    });
};

// get Product update page
exports.getProductUpdatePage = async (req, res) => {
  let product = await Product.findOne({ _id: req.params._id })
    .populate('relatedProducts')
    .populate('features.label')
    .populate('category')
    .populate('subcategory');
  let specifications = await Specification.find({ enabled: true });
  let discount = await Discount.find({ type: 'product' });
  let cat = product.category;
  let sub = product.subcategory;
  let motherboard = false;
  let ram = false;
  if (
    cat.name === 'DESKTOP COMPONENT' ||
    cat.name === 'Desktop Component' ||
    cat.name === 'Desktop component'
  ) {
    if (
      sub.name === 'Motherboard' ||
      sub.name === 'motherboard' ||
      sub.name === 'MOTHERBOARD'
    ) {
      motherboard = true;
    }
    if (
      sub.name === 'RAM' ||
      sub.name === 'ram' ||
      sub.name === 'Desktop RAM' ||
      sub.name === 'DESKTOP RAM'
    ) {
      ram = true;
    }
  }
  let pro = await Product.find();

  res.render('products/update', {
    product,
    feature_total: product.features.length,
    specifications,
    motherboard,
    ram,
    discount,
    Product: pro,
  });
};

// saving product for dealer products
exports.SaveProductDealer = async (req, res) => {
  var data = req.body.data;
  await Product.update({ _id: data._id }, { $set: data }, { upsert: true });
  res.send({});
};

// saving product for local purchase products
exports.SaveProductLP = async (req, res) => {
  var data = req.body.data;
  await Product.update({ _id: data._id }, { $set: data }, { upsert: true });
  await Serial.insertMany(req.body.serials);
  res.send({});
};

// updating product for local purchase products
exports.updateProduct = async (req, res) => {
  var data = req.body.data;
  await Product.update({ _id: data._id }, { $set: data }, { upsert: true });
  res.send({});
};

// checks whether any of the given serials already exists or not
exports.checkSerials = async (req, res) => {
  var arr = req.body.serial_array;
  var exists = [];
  var serials = await Serial.find({ pid: req.body.pid });

  serials.map((serial) => {
    if (arr.includes(serial.number)) {
      exists.push(serial.number);
    }
  });

  res.send({ exists });
};

// saves image in folder
exports.SaveImage3 = async (req, res) => {
  await req.files.map(async (image) => {
    var link = `https://ecom-admin.herokuapp.com/image/${image.filename}`;
    await Product.update(
      { _id: req.body.pid },
      { $addToSet: { image: link } },
      { upsert: true }
    );
  });
  res.redirect(`/products/Update/${req.body.pid}#IMAGES1`);
};

// delete image url from product
exports.deteteImg = (req, res) => {
  filename = req.body.img.split('image/')[1];

  Product.updateOne(
    { _id: req.body.id },
    { $pull: { image: req.body.img } },
    { upsert: true },
    (err, docs) => {
      if (err) logger.info(err);
      else {
        gfs.remove({ filename }, (err) => {
          res.redirect(`/products/Update/${req.body.id}#IMAGES1`);
        });
      }
    }
  );
};

// In-house stock product entry page
exports.getInhouseInventoryPage = async (req, res) => {
  let localPurchase = await LocalPurchase.find();
  res.render('products/InhouseStockProduct', { LocalPurchase: localPurchase });
};

// dealer stock product entry page
exports.getDealerInventoryPage = async (req, res) => {
  let cat = await Category.find();
  let categories = await SubCategory.find();
  let brand = await Brand.find();
  res.render('products/dealerProduct', { cat, categories, brand });
};

// shows the number of fields user wants
exports.showProductRegistrationFields = async (req, res, next) => {
  var category = req.body.categg.split(',');
  var brand = req.body.brandg.split(',');
  var model = req.body.model;
  await Category.updateOne(
    { _id: category[0] },
    { $addToSet: { brands: brand[0] } },
    { upsert: true }
  );
  var product = {
    category: category[0],
    brand: brand[0],
    model: model,
  };
  var obj = {
    category: category[0],
    brand: brand[0],
  };
  // if there is no sub category of that category
  if (req.body.subCategg != '0') {
    var subcategory = req.body.subCategg.split(',');
    await SubCategory.updateOne(
      { _id: subcategory[0] },
      { $addToSet: { brands: brand[0] } },
      { upsert: true }
    );
    (product.subcategory = subcategory[0]),
      (product.productName =
        category[1] + '-' + subcategory[1] + '-' + brand[1] + '-' + model);
    product.pid = category[1].substr(0, 2) + brand[1].substr(0, 2);
    obj.subcategory = subcategory[0];
  } else {
    product.productName = category[1] + '-' + brand[1] + '-' + model;
    product.pid = category[1].substr(0, 2) + brand[1].substr(0, 2);
  }

  // get all the features of cat sub and brand
  Product.find(obj, function (err, pros) {
    var features = [];
    if (!pros) {
      pros.map((product) => {
        product.features.map((feature) => {
          features.push(feature.label);
        });
      });
    }
    // checks whether the model already exists or not
    Product.findOne({ model: model }, (err, result) => {
      if (!result) {
        new Product(product).save().then((product) =>
          res.render('products/dealerProduct', {
            product,
            features,
            feature_total: features.length,
          })
        );
      } else {
        req.flash('error_msg', 'The product already exists!');
        res.render('products/dealerProduct');
      }
    });
  });
};

var changeStatus = (condition, object, res, cb) => {
  Product.update(
    condition,
    { $set: object },
    { upsert: true },
    function (err, docs) {
      if (err) logger.info(err);
      cb(docs);
    }
  );
};

//find fuction from product collection
var find = (obj, cb) => {
  Product.find(obj)
    .populate('brand')
    .populate('admin')
    .populate('subcategory')
    .populate('category')
    .exec(function (err, docs) {
      cb(docs);
    });
};

// returns Edit page from product info
exports.getEditpage = (req, res, next) => {
  find({ _id: mongo.ObjectID(req.params.id) }, (docs) => {
    res.render('products/update', {
      title: 'Update Product',
      product: docs[0],
      num_feature: docs[0].features.length,
    });
  });
};

// returns product offline stock
exports.makeNotActive = (req, res) => {
  var obj = { isActive: false };
  changeStatus({ _id: req.params.id }, obj, res, (docs) => {
    res.redirect('/products/viewProducts');
  });
};

// makes product online
exports.makeActive = (req, res) => {
  var obj = { isActive: true };
  changeStatus({ _id: req.params.id }, obj, res, (docs) => {
    res.redirect('/products/viewProducts');
  });
};

// make product available
exports.makeAvailable = (req, res) => {
  var obj = { availablity: true };
  changeStatus({ _id: req.params.id }, obj, res, (docs) => {
    res.redirect('/products/viewProducts');
  });
};

exports.getSerials = (req, res) => {
  Serial.find()
    .populate('pid')
    .populate('lp')
    .populate('invoice')
    .exec((err, serials) => {
      var count = 1;
      serials.map((doc) => {
        if (doc.status == 'Delivered') {
          logger.info(doc);
        }
        doc.count = count++;
      });
      res.render('products/allSerials', { serials });
    });
};

// show all the products and their quantity with low stock
exports.viewLowQuantityProducts = async (req, res) => {
  var products = await Product.find();
  var serials = [];
  var count = 1;
  for (var i = 0; i < products.length; i++) {
    var data = await Serial.find({
      $and: [{ pid: products[i]._id }, { status: 'In Stock' }],
    })
      .populate('pid')
      .populate('lp')
      .populate('invoice');

    if (data.length < 5) {
      var obj = {
        product: products[i],
        quantity: data.length,
        count: count,
      };
      serials.push(obj);
      count++;
    }
  }
  res.render('products/LowInStock', { serials });
};

// make product not available
exports.makeNotAvailable = (req, res) => {
  var obj = { availablity: false };
  changeStatus({ _id: req.params.id }, obj, res, (docs) => {
    res.redirect('/products/viewProducts');
  });
};

// get inventory list by filter
var get_all_inventory_list = (condition, sort_obj, cb) => {
  Inventory.find(condition)
    .sort(sort_obj)
    .populate('product_id')
    .populate('admin')
    .exec((err, rs) => {
      cb(rs);
    });
};

// check availability
exports.check_availablity = (req, res, next) => {
  var pre_arr = '';
  get_all_inventory_list({ product_id: req.params.model }, {}, (rs) => {
    if (rs != null) {
      rs.map((inventory) => {
        var ser = inventory.serial;
        for (var i = 0; i < ser.length; i++) {
          pre_arr += ser[i];
          if (i < ser.length - 1) {
            pre_arr += ',';
          }
        }
      });
      res.json({ data: pre_arr });
    }
  });
};
