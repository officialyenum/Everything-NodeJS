const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  Product.find({})
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // res.sendFile(path.join(rootDir, 'views', 'edit-product.html'));
};

exports.getProducts = (req, res, next) => {
  // console.log('Add Product Form');
  Product.find({})
    .lean()
    .then((products) => {
      console.log(products);
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
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(obj); // { title: 'product' }
  const product = new Product({
    title: obj.title,
    price: obj.price,
    description: obj.description,
    imageUrl: obj.imageUrl,
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
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(obj); // { title: 'product' }
  Product.findById(obj.id)
    .then((product) => {
      product.title = obj.title;
      product.price = obj.price;
      product.description = obj.description;
      product.imageUrl = obj.imageUrl;
      return product.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProducts = (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
  // console.log(obj); // { title: 'product' }
  Product.findByIdAndRemove(obj.productId)
    .then(() => {
      console.log("Product Deleted ");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  // products.push(obj);
};
