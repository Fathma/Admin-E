const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
// const morgan = require("morgan");
const path = require("path");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const HandlebarsIntl = require("handlebars-intl");
const Handlebars = require("handlebars");
const moment = require("moment");
const expressValidator = require('express-validator');
const Grid = require('gridfs-stream')

const app = express();
var compression = require('compression')
app.use(compression())

var cors = require('cors')
app.use(cors())




const keys = require('./config/keys')
var vlaues = require('./config/values')



moment().format();

// role
const { ensureAuthenticated } = require("./src/helpers/auth");
const { Administrator, Editor, Contributor } = require("./src/helpers/rolecheck");



// Load routes controller
const ordersRoutes = require("./src/routes/orders.routes");
const categoryRoutes = require("./src/routes/category.routes");
const usersRoutes = require("./src/routes/users.routes");
const productsRoutes = require("./src/routes/products.routes");
const customerRoutes = require("./src/routes/customer.routes");
const invoiceRoutes = require("./src/routes/invoice.routes")
const purchaseRoutes = require("./src/routes/purchase.routes")
const supplierRoutes = require("./src/routes/supplier.routes")
const generalRoutes = require("./src/routes/general.routes")
var forumRoutes = require("./src/routes/forum.routes")
var promotionsRoutes = require("./src/routes/promotions.routes")



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

// app.use(morgan("dev"));

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


// Gloabl variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); 
  res.locals.errors = req.flash("errors");
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  res.locals.productentry_msg = vlaues.msg.productentry;
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


app.get("/",async (req, res) => {
  if (req.user) {
    res.redirect("/general/showDashboard")
  } else {
    res.redirect("/users/login")
  }
})

// base routes
app.use("/category", ensureAuthenticated, Editor, categoryRoutes)
app.use("/users",   usersRoutes);
app.use("/orders", ensureAuthenticated, Contributor, ordersRoutes)
app.use("/invoice", ensureAuthenticated, Contributor, invoiceRoutes)
app.use("/customers", ensureAuthenticated, Administrator, customerRoutes)
app.use("/products", Editor,ensureAuthenticated,  productsRoutes)
app.use("/purchase", ensureAuthenticated, Editor, purchaseRoutes)
app.use("/supplier", ensureAuthenticated, Editor,  supplierRoutes)
app.use("/general",  generalRoutes);
app.use("/forum", ensureAuthenticated, Contributor, forumRoutes)
app.use("/promotions", ensureAuthenticated, Contributor, promotionsRoutes)


// // //Port For the Application
// const port = process.env.PORT || 3000

// app.listen(port, () => console.log("The server is live on http://127.0.0.1:3000/"))

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 3000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    
  });
})