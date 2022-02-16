const Product = require("../models/product");
const User = require("../models/user");
// const Cart = require("../models/cart");
// const Order = require("../models/order");
// let product;

// exports.getCheckout = (req, res, next) => {
//   res.render("web/product/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//     activeCheckout: true,
//   });
// };

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("web/product/cart", {
        products: products.map((product) => product),
        docTitle: "Your Cart",
        path: "/cart",
        hasProducts: products.length > 0,
        activeCart: true,
        cartCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const product_id = obj.product_id;
  req.user
    .deleteItemFromCart(product_id)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findById(product_id, (product) => {
  //     Cart.deleteProduct(product_id, product.price);
  //     res.redirect('/cart')
  // })
};

exports.postCart = (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const product_id = obj.product_id;
  Product.findById(product_id)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render("web/product/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        activeOrders: true,
        orders: orders,
        hasOrders: orders.length > 0,
        activeWebOrder: true,
        orderCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("web/product/product-list", {
        prods: products,
        docTitle: "Products",
        path: "/products",
        hasProducts: products.length > 0,
        activeWebProduct: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      console.log(product);
      res.render("web/product/product-detail", {
        prod: product,
        docTitle: "Product Detail",
        path: `/products/${id}`,
        activeWebProduct: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      console.log("get Index: ", products);
      res.render("web/index", {
        prods: products,
        docTitle: "Home",
        path: "/",
        hasProducts: products.length > 0,
        activeHome: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
