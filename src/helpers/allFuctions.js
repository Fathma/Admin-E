const Product = require("../product/Product");
// const Inventory = require("../models/inventory.model");
const Order = require("../order/customerOrder");

// // get inventory list by filter
// exports.get_inventory_list_new = async (condition, sort_obj, populate_obj) => {
//   return await Inventory.find(condition).sort(sort_obj).populate(populate_obj)
// };

// // get inventory list by filter
// exports.get_all_inventory_list = (condition, sort_obj, cb) => {
//   Inventory.find(condition).sort(sort_obj).populate("product_id").populate("admin").exec((err, rs)=>{ cb(rs); });
// };

//find fuction from product collection
exports.find = (obj, cb) => {
  Product.find(obj).populate("brand").populate("admin").populate("subcategory").populate("category").exec(function(err, docs) { cb(docs); });
};

// update function
exports.changeStatus = (condition,  object, res, cb) => {
  Product.update(condition,{ $set: object },{ upsert: true }, function(err, docs) {
      if (err) { console.log(err); }
      console.log(docs)
      cb(docs)
    }
  );
};

exports.get_allProduct_page= (res, docs , title)=>{
  res.render("products/allProductView", {
    title: title,
    products: docs
  });
}

// adds the live and remaining
exports.live_wise_inventory = (docs,cb)=>{
  docs.total_stock = 0;
  docs.map((inventory)=>{
    if(inventory.product_id){
      var count=0;
      inventory.product_id.live.serial.map((serial)=>{
        if((inventory._id).toString() === (serial.inventory).toString()){
          count++;
        }
      })
      inventory.count=count;
    }
  })
  cb(docs)
}

// orders
exports.get_orders = (condition, cb)=>{
  Order.find(condition).sort({ "created": 1 }).populate("cart.product").populate("user").populate('cart.serials').exec((err, rs)=>{ cb(rs); })
}

// function for getting live data
exports.get_live = async (condition)=>{
  return await Product.find(condition)
}

// checks availability of a model
exports.checkAvailability= (model1,name)=> model1.find({ name: name })



