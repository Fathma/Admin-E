const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const HandlebarsIntl = require("handlebars-intl");
const Handlebars = require("handlebars");
const moment = require("moment");
const expressValidator = require('express-validator');
const Grid = require('gridfs-stream')

 

// Loads models
var Category = require("./src/models/category.model");
var Product = require("./src/models/product.model");
var LocalPurchase = require("./src/models/localPurchase.model");
var Supplier = require("./src/models/supplier.model");
var SubCategory = require("./src/models/subCategory.model");
var PostCategory = require('./src/models/postCategory.model')
var Specification  = require('./src/models/specification.model')
var Brand = require("./src/models/brand.model");

const keys = require('./config/keys')
var vlaues = require('./config/values')


moment().format();

// role
const { ensureAuthenticated } = require("./src/helpers/auth");
const { Administrator, Editor, Contributor } = require("./src/helpers/rolecheck");

const app = express();

// Load routes controller
const ordersRoutes = require("./src/routes/orders.routes");
const categoryRoutes = require("./src/routes/category.routes");
const usersRoutes = require("./src/routes/users.routes");
const productsRoutes = require("./src/routes/products.routes");
const customerRoutes = require("./src/routes/customer.routes");
const invoiceRoutes = require("./src/routes/invoice.routes");
const purchaseRoutes = require("./src/routes/purchase.routes");
const supplierRoutes = require("./src/routes/supplier.routes");
const generalRoutes = require("./src/routes/general.routes");
var forumRoutes = require("./src/routes/forum.routes")



// Passport config
require("./config/passport")(passport);

// Map global promise
mongoose.Promise = global.Promise;

mongoose.connect( keys.database.mongoURI, err => {
  if (!err) console.log("MongoDB connection Established, " + keys.database.mongoURI);
  else console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
});


var con = mongoose.connection;
 

let gfs;
con.once('open', function () {
  gfs = Grid(con.db, mongoose.mongo);
  gfs.collection('fs');
})

HandlebarsIntl.registerWith(Handlebars);

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

const hbs = handlebars.create({
  defaultLayout: "main",
  // custom helpers for 'if(something1 === something2){ do something }'
  helpers: {
    equality: function(value1, value2, block) {
      if (value1 === undefined ||value1 === null || value2 === undefined || value2 === null) {
      } else {
        if (value1.toString() == value2.toString()) {
          return block.fn(true);
        } else return block.inverse(false);
      }
    }
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(methodOverride("_method"));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, "static")));


// Express session middleware
app.use( session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware for flash msg
app.use(flash());

Handlebars.registerHelper("formatTime", function(date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
});

// middleware
// app.use(function(req, res, next) {
//   Category.find()
//     .populate("subCategories")
//     .exec(function(err, categories) {
//       if (err) return next(err);
//       res.locals.S_categories = categories;
//       next();
//     });
// });

// Gloabl variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); 
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  res.locals.productentry_msg = vlaues.msg.productentry;
  next();
});

// middleware
app.use(async (req, res, next)=>{
  // res.locals.specifications = await Specification.find()
  res.locals.cat = await Category.find()
  res.locals.categories = await SubCategory.find()
  res.locals.brand = await Brand.find()
  res.locals.Product = await Product.find()
  res.locals.Supplier = await Supplier.find()
  res.locals.LocalPurchase = await LocalPurchase.find()
  next();
});

// route for fetching image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if(file != null ){
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    }
  })
});


app.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/general/showDashboard");
  } else {
    res.redirect("/users/login");
  }
});

// base routes
app.use("/category", ensureAuthenticated, Editor, categoryRoutes);
app.use("/users",   usersRoutes);
app.use("/orders", ensureAuthenticated, Contributor, ordersRoutes);
app.use("/invoice", ensureAuthenticated, Contributor, invoiceRoutes);
app.use("/customers", ensureAuthenticated, Administrator, customerRoutes);
app.use("/products", Editor,ensureAuthenticated,  productsRoutes);
app.use("/purchase", ensureAuthenticated, Editor, purchaseRoutes);
app.use("/supplier", ensureAuthenticated, Editor,  supplierRoutes);
app.use("/general",  generalRoutes);
app.use("/forum", ensureAuthenticated, Contributor, forumRoutes);


// //Port For the Application
const port = process.env.PORT || 3000;

app.listen(port, () => console.log("The server is live on http://127.0.0.1:3000/"));
