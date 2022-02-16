const Product = require("../models/product");
const Cart = require("../models/cart");
// let product;

exports.getCheckout = (req,res,next) => {
    res.render('web/product/checkout', {
        docTitle: 'Checkout',
        path: '/checkout',
        activeCheckout: true,
    });
    
};

exports.getCart = (req,res,next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('web/product/cart', {
                products: cartProducts,
                docTitle: 'Your Cart',
                path: '/cart',
                hasProducts: cartProducts.length > 0,
                activeCart: true,
                productCSS: true
            });
        })
    });
};

exports.deleteCartItem = (req,res,next) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    const product_id = obj.product_id;
    Product.findById(product_id, (product) => {
        Cart.deleteProduct(product_id, product.price);
        res.redirect('/cart')
    })
}

exports.postCart = (req,res,next) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    const product_id = obj.product_id;
    Product.findById(product_id, (product) => {
        Cart.addProduct(product_id, product.price);
        res.redirect('/cart')
    })
};

exports.getOrders = (req,res,next) => {
    res.render('web/product/orders', {
        docTitle: 'Your Orders',
        path: '/orders',
        activeOrders: true,
    });
};

exports.getProducts = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('web/product/product-list', {
            prods: products,
            docTitle: 'Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeWebProduct: true,
            productCSS: true
        });
    });
    
};

exports.getProduct = (req,res,next) => {
    const id = req.params.id;
    Product.findById(id, product => {
        // console.log(product);
        res.render('web/product/product-detail', {
            prod: product,
            docTitle: 'Product Detail',
            path: `/products/${id}`,
            activeWebProduct: true,
            productCSS: true
        });
    });
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('web/index', {
            prods: products,
            docTitle: 'Home',
            path: '/',
            hasProducts: products.length > 0,
            activeHome: true,
            productCSS: true
        }); 
    });
};


