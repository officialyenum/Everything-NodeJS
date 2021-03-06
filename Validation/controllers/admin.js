const Product = require("../models/product");
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
      console.log(err);
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
      console.log(err);
    });
};

exports.postAddProducts = (req, res, next) => {
  const { id, title, price, description, imageUrl } = req.body; // req.body = [Object: null prototype] { title: 'yenum' }
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
            imageUrl: imageUrl,
          },
          validationErrors: errors.array(),
        });
      });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProducts = (req, res, next) => {
  const { id, title, price, description, imageUrl } = req.body; // req.body = [Object: null prototype] { title: 'yenum' }
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
        imageUrl: imageUrl,
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
      product.imageUrl = imageUrl;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProducts = (req, res, next) => {
  const productId = req.body.productId; // req.body = [Object: null prototype] { title: 'yenum' }
  Product.deleteOne({
    _id: productId,
    userId: req.user._id,
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  // products.push(obj);
};
