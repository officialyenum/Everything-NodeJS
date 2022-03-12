const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");
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
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      console.log(order);
      if (!order) {
        next(new Error("No Orders Found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      console.log(orderId);
      console.log(invoicePath);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.fontSize(14).text("---------------------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x $" +
              prod.product.price
          );
      });
      pdfDoc.text("---------------------------------------");
      pdfDoc.fontSize(20).text("Total Price : $" + totalPrice);
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     next(err);
      //   }
      //   console.log(data);
      //   res.setHeader("Content-Type", "application/pdf");
      //   // Direct download / print
      //   res.setHeader(
      //     "Content-Disposition",
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   // View before download / print
      //   // res.setHeader(
      //   //   "Content-Disposition",
      //   //   'inline; filename="' + invoiceName + '"'
      //   // );
      //   res.send(data);
      // });

      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCart = (req, res, next) => {
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // Product.findById(product_id, (product) => {
  //     Cart.deleteProduct(product_id, product.price);
  //     res.redirect('/cart')
  // })
};

exports.postCart = (req, res, next) => {
  console.log("posting to cart");
  console.log(req.body.product_id);
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
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
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
      console.log(result);
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
