const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
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

app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(webRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    User.findOne()
      .lean()
      .then((user) => {
        if (!user) {
          const user = new User({
            username: "yenum",
            email: "oponechukwuyenum@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      });
    app.listen(3000);
  })
  .catch((err) => {});
