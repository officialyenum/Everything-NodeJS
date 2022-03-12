const Product = require("../models/product");
const fileHelper = require('../util/file');
const { validationResult } = require("express-validator");

exports.getAddProducts = (req, res, next) => {
  console.log(`Logged User : ${req.user._id}`);
  Product.find({ userId: req.user._id })
    .lean()
    .then((products) => {
      res.render("admin/add-product", {
        docTitle: "Admin Add Product",
        path: "/admin/add-product",
        prods: products,
        hasProducts: products.length > 0,
        activeAddProduct: true,
        formCSS: true,
        productCSS: true,
        errorMessage: null,
      });
    });
};

exports.getEditProducts = (req, res, next) => {
  // const editMode = req.query.edit; // For Using Query params
  const id = req.params.id;
  Product.findById(id)
    .lean()
    .then((product) => {
      res.render("admin/edit-product", {
        product: product,
        docTitle: "Admin Edit Product",
        path: "/admin/edit-product",
        activeProduct: true,
        formCSS: true,
        productCSS: true,
        errorMessage: null,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // res.sendFile(path.join(rootDir, 'views', 'edit-product.html'));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .lean()
    .then((products) => {
      res.render("admin/product-list", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        activeProduct: true,
        formCSS: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddProducts = (req, res, next) => {
  const { id, title, price, description } = req.body; // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array);
    Product.find({ userId: req.user._id })
      .lean()
      .then((products) => {
        return res.status(422).render("admin/add-product", {
          docTitle: "Admin Add Product",
          path: "/admin/add-product",
          activeProduct: true,
          formCSS: true,
          productCSS: true,
          prods: products,
          errorMessage: errors.array()[0].msg,
          product: {
            title: title,
            price: price,
            description: description,
          },
          validationErrors: errors.array(),
        });
      });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: "/" + req.file.path,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProducts = (req, res, next) => {
  const { id, title, price, description } = req.body; // req.body = [Object: null prototype] { title: 'yenum' }
  const image = req.file;
  console.log(req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array);
    return res.status(422).render("admin/edit-product", {
      docTitle: "Admin Edit Product",
      path: "/admin/edit-product",
      activeProduct: true,
      formCSS: true,
      productCSS: true,
      errorMessage: errors.array()[0].msg,
      product: {
        _id: id,
        title: title,
        price: price,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }
  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;

      if (image) { 
        fileHelper.deleteFile(product.imageUrl.substring(1)); // pop "/" 
        product.imageUrl = "/" + image.path;
      }
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProducts = (req, res, next) => {
  console.log("deleting product");
  const productId = req.params.productId; // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(productId);
  Product.findById(productId).then((product)=>{
    if(!product){
      next(new Error("Product not found"));
    }
    fileHelper.deleteFile(product.imageUrl.substring(1));
    return Product.deleteOne({
      _id: productId,
      userId: req.user._id,
    });
  })
  .then(() => {
    res.status(200).json({
      message:"Success!"
    });
  })
  .catch((err) => {
    res.status(500).json({
      message:"Deleting Product failed!"
    });
  });
  // products.push(obj);
};
