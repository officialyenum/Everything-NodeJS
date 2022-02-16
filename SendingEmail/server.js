const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const flash = require('connect-flash');

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://yenum:chucky2020@cluster0.ylglq.mongodb.net/shop";
const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

// Setting up body parser
//Using handleBars Engine
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    defaultLayout: "master",
    extname: "hbs",
    helpers: {
      mult: function (a, b) {
        return a * b;
      },
    },
  })
);
app.set("view engine", "hbs");
// Using Pug Engine
// app.set('view engine', 'pug');
app.set("views", "views");

const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
// Serving files statically
app.use(express.static(path.join(__dirname, "public")));
// Configure Session in app
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

// app.use('/',(req,res,next) => {
//     console.log('First Middleware');
//     next();
// });
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  // res.locals.errorMessage = req.flash('error');
  // res.locals.successMessage = req.flash('success');
  next();
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(webRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected on port 3004")
    app.listen(3004);
  })
  .catch((err) => {});
