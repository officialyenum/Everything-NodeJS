const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const { body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  // route
  "/login",
  //Validations
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "oponechukwuyenum@gmail.com") {
        //   throw new Error("This Email is forbidden");
        // }
        return User.findOne({ email: email }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email Address exist already pick a different one"
            );
          }
        });
      }),
    body(
      "password",
      "Please enter password with only numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  //controller
  authController.postLogin
);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body(
      "password",
      "Please enter password with only numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      console.log(`${value} === ${req.body.password}`);
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
