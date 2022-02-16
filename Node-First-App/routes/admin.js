const express = require('express');
// const path = require('path');
// const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();
const products = []

router.get('/add-product', adminController.getAddProducts)
router.get('/edit-product/:id', adminController.getEditProducts)
router.get('/products', adminController.getProducts)

router.post('/add-product', adminController.postAddProducts)
router.post('/edit-product', adminController.postEditProducts)
router.post('/delete-product', adminController.postDeleteProducts)

module.exports = router;
// exports.routes = router;
// exports.products = products;