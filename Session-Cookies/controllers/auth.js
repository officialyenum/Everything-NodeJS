const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(res.session);
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    authCSS: true,
    formCSS: true,
    activeLogin: true,
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.session.user);
  User.findById("619308553a7c6d92dcf7de2c")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
          res.redirect("/login");
        } else {
          console.log(req.session.user); // YOU WILL GET THE UUID IN A JSON FORMAT
          res.redirect("/");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Session is destroyed");
      res.redirect("/");
    }
  });
};
