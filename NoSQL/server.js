const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const expressHbs = require("express-handlebars");
const mongoConnect = require("./util/database").mongoConnect;
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
  User.findById("6175e5246ee0cefb22a7d8ed")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(webRoutes);

mongoConnect(() => {
  app.listen(3003);
});
