const express = require("express");
// const path = require('path');
// const rootDir = require('../util/path');
const shopController = require("../controllers/shop");
const errorController = require("../controllers/errors");
const isAuth = require("../middleware/is-auth");

const router = express.Router();
// const adminData = require('./admin');

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:id", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.deleteCartItem);
router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);

router.use(errorController.getNoPageFound);

module.exports = router;
