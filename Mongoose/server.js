const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const expressHbs = require("express-handlebars");
const User = require("./models/user");

const app = express();

const webRoutes = require("./routes/web");
const adminRoutes = require("./routes/admin");

// Setting up body parser
app.use(bodyParser.urlencoded({ extended: false }));
// Serving files statically
app.use(express.static(path.join(__dirname, "public")));
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

// app.use('/',(req,res,next) => {
//     console.log('First Middleware');
//     next();
// });

app.use((req, res, next) => {
  User.findById("619308553a7c6d92dcf7de2c")
    .then((user) => {
      req.user = new User({
        username: user.username,
        email: user.email,
        cart: user.cart,
        _id: user._id,
      });
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(webRoutes);

mongoose
  .connect(
    "mongodb+srv://yenum:chucky2020@cluster0.ylglq.mongodb.net/shop?retryWrites=true&w=majority"
  )
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
    app.listen(3001);
  })
  .catch((err) => {});
