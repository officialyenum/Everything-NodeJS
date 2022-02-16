const Product = require("../models/product");

let product;

exports.getAddProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
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
  Product.fetchAll()
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
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(obj); // { title: 'product' }
  const product = new Product(
    obj.title,
    obj.price,
    obj.description,
    obj.imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.create({
  //     title: obj.title,
  //     imageUrl: obj.imageUrl,
  //     price: obj.price,
  //     description: obj.description,
  //     userId: req.user.id
  // })
  // .then(result => {
  //     res.redirect('/');
  // })
  // .catch(err => {
  //     console.log(err);
  // })
  // products.push(obj);
};

exports.postEditProducts = (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
  console.log(obj); // { title: 'product' }
  const product = new Product(
    obj.title,
    obj.price,
    obj.description,
    obj.imageUrl,
    obj.id,
    req.user._id
  );
  product
    .save()
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
  Product.deleteById(obj.productId)
    .then(() => {
      console.log("Product Deleted ");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  // products.push(obj);
};
