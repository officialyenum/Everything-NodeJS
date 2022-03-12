const express = require("express");
// const path = require('path');
// const rootDir = require('../util/path');
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const router = express.Router();
const products = [];

router.get("/add-product", isAuth, adminController.getAddProducts);
router.get("/edit-product/:id", isAuth, adminController.getEditProducts);
router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProducts
);
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProducts
);
router.delete("/product/:productId", isAuth, adminController.deleteProducts);

module.exports = router;
// exports.routes = router;
// exports.products = products;
