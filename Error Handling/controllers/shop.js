const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
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
  console.log(req.user);
  console.log(req.session.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("web/product/cart", {
        products: products.map((product) => product.toJSON()),
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
    .removeFromCart(product_id)
    .then((user) => {
      console.log(user);
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
  console.log(req.user);
  console.log(req.session.user);
  const obj = JSON.parse(JSON.stringify(req.body));
  const product_id = obj.product_id;
  Product.findById(product_id)
    .then((product) => {
      console.log("Get Product");
      console.log(product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        // return { quantity: i.quantity, product: i.productId._doc }; This returns product id
        return { quantity: i.quantity, product: { ...i.productId._doc } }; // This returns product document
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("web/product/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        activeOrders: true,
        orders: orders.map((order) => order.toJSON()),
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
  Product.find({})
    .lean()
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
  console.log(req.user);
  console.log(req.session.user);
  const id = req.params.id;
  Product.findById(id)
    .lean()
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
  console.log(req.user);
  console.log(req.session.user);
  Product.find({})
    .lean()
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
