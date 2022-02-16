const express = require("express");
// const path = require('path');
// const rootDir = require('../util/path');
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
const products = [];

router.get("/add-product", isAuth, adminController.getAddProducts);
router.get("/edit-product/:id", isAuth, adminController.getEditProducts);
router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProducts);
router.post("/edit-product", isAuth, adminController.postEditProducts);
router.post("/delete-product", isAuth, adminController.postDeleteProducts);

module.exports = router;
// exports.routes = router;
// exports.products = products;
