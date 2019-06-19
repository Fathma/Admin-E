const express = require("express");
// const handlebars = require("express-handlebars");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const flash = require("connect-flash");
// const session = require("express-session");
// const passport = require("passport");
// // const dbConfig = require("./config/database");
// var Category = require("./models/category.model");
// var Product = require("./models/Product");
// var LocalPurchase = require("./models/localPurchase.model");
// var Supplier = require("./models/supplier.model");
// var SubCategory = require("./models/subCategory.model");
// var PostCategory = require('./models/PostCategory.model')
// const keys = require('./config/keys')

// var Brand = require("./models/brand.model");
// const morgan = require("morgan");
// var path = require("path");
// var mongoStore = require("connect-mongo")(session);
// const methodOverride = require("method-override");
// var HandlebarsIntl = require("handlebars-intl");
// var Handlebars = require("handlebars");
// var moment = require("moment");
// var expressValidator = require('express-validator');
// moment().format();

// // // role
// const { ensureAuthenticated } = require("./helpers/auth");
// // const { Super } = require("./helpers/rolecheck");
// // const { SuperPublisher } = require("./helpers/rolecheck");
const app = express();

// // // Load routes controller
// const ordersRoutes = require("./routes/orders.routes");
// const categoryRoutes = require("./routes/category.routes");
// const usersRoutes = require("./routes/users.routes");
// const productsRoutes = require("./routes/products.routes");
// const customerRoutes = require("./routes/customer.routes");
// const invoiceRoutes = require("./routes/invoice.routes");
// const purchaseRoutes = require("./routes/purchase.routes");
// const supplierRoutes = require("./routes/supplier.routes");
// const generalRoutes = require("./routes/general.routes");
// var forumRoutes = require("./routes/forum.routes")

// // Passport config
// require("./config/passport")(passport);

// // Map global promise
// mongoose.Promise = global.Promise;

// //DB Connection
// mongoose.connect( keys.database.mongoURI, err => {
//   if (!err) console.log("MongoDB connection Established, " + keys.database.mongoURI);
//   else console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
// });

// HandlebarsIntl.registerWith(Handlebars);

// app.use(morgan("dev"));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());

// const hbs = handlebars.create({
//   defaultLayout: "main",
//   // custom helpers for 'if(something1 === something2){ do something }'
//   helpers: {
//     equality: function(value1, value2, block) {
//       if (value1 === undefined ||value1 === null || value2 === undefined || value2 === null) {
//       } else {
//         if (value1.toString() == value2.toString()) {
//           return block.fn(true);
//         } else return block.inverse(false);
//       }
//     }
//   }
// });

// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");
// app.use(methodOverride("_method"));

// // Body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// //Static Folder
// app.use(express.static(path.join(__dirname, "public")));

// // Express session middleware
// app.use(
//   session({
//     secret: "443@#09&*Km!lfvMNSodwejOosdkdsafk(^$@^&*()0dfm43",
//     resave: false,
//     saveUninitialized: false,
//     store: new mongoStore({ mongooseConnection: mongoose.connection }),
//     cookie: { maxAge: 180 * 60 * 1000 }
//   })
// );

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// Handlebars.registerHelper("formatTime", function(date, format) {
//   var mmnt = moment(date);
//   return mmnt.format(format);
// });

// // middleware
// app.use(function(req, res, next) {
//   Category.find()
//     .populate("subCategories")
//     .exec(function(err, categories) {
//       if (err) return next(err);
//       res.locals.S_categories = categories;
//       next();
//     });
// });

// // Gloabl variables
// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   res.locals.user = req.user || null;
//   res.locals.session = req.session;
//   next();
// });

// // middleware
// app.use(async (req, res, next)=>{
//   res.locals.cat = await Category.find()
//   res.locals.categories = await SubCategory.find()
//   res.locals.brand = await Brand.find()
//   res.locals.Product = await Product.find()
//   res.locals.Supplier = await Supplier.find()
//   res.locals.LocalPurchase = await LocalPurchase.find()
//   next();
// });

app.get("/", (req, res) => {
  res.send("dskfklsdjfl")
 
  // if (req.user) {
  //   res.redirect("/general/showDashboard");
  // } else {
  //   res.redirect("/users/login");
  // }
});

// // base routes
// app.use("/category", ensureAuthenticated, categoryRoutes);
// app.use("/users",   usersRoutes);
// app.use("/orders", ensureAuthenticated, ordersRoutes);
// app.use("/invoice", ensureAuthenticated,  invoiceRoutes);
// app.use("/customers", ensureAuthenticated, customerRoutes);
// app.use("/products",  productsRoutes);
// app.use("/purchase", ensureAuthenticated,  purchaseRoutes);
// app.use("/supplier", ensureAuthenticated,  supplierRoutes);
// app.use("/general", ensureAuthenticated, generalRoutes);
// app.use("/forum", ensureAuthenticated, forumRoutes);

// //Port For the Application
const port = process.env.PORT || 3000;

app.listen(port, () => console.log("The server is live on http://127.0.0.1:3000/"));
