const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const flash = require("connect-flash");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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
      add: function (a, b) {
        return a + b;
      },
      if_and: function (a, b, opts) {
        if (a && b)
          // Or === depending on your needs
          return opts.fn(this);
        else return opts.inverse(this);
      },
      if_not_eq: function (a, b, opts) {
        if (a != b)
          // Or === depending on your needs
          return opts.fn(this);
        else return opts.inverse(this);
      },
      if_not_eq_type: function (a, b, opts) {
        if (a !== b)
          // Or === depending on your needs
          return opts.fn(this);
        else return opts.inverse(this);
      },
      if_eq: function (a, b, opts) {
        if (a == b)
          // Or === depending on your needs
          return opts.fn(this);
        else return opts.inverse(this);
      },
      if_not_eq_and_not_eq: function (a, b, c, d, opts) {
        if (a !== b && c !== d)
          // Or === depending on your needs
          return opts.fn(this);
        else return opts.inverse(this);
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
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// Serving files statically
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  // res.locals.errorMessage = req.flash('error');
  // res.locals.successMessage = req.flash('success');
  next();
});

app.use((req, res, next) => {
  // throw new Error("Sync Dummy");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(webRoutes);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("web/500", {
    docTitle: "An error Occured",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("connected to mongo db");
    app.listen(process.env.PORT);
    console.log("connected on port "+process.env.PORT);
  })
  .catch((err) => {});
