const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
// let product;

exports.getCheckout = (req,res,next) => {
    res.render('web/product/checkout', {
        docTitle: 'Checkout',
        path: '/checkout',
        activeCheckout: true,
    });
    
};

exports.getCart = (req,res,next) => {

    req.user
        .getCart()
        .then(cart => {
            cart.getProducts()
                .then(products => {
                    res.render('web/product/cart', {
                        products: products.map(product => product.toJSON()),
                        docTitle: 'Your Cart',
                        path: '/cart',
                        hasProducts: products.length > 0,
                        activeCart: true,
                        cartCSS: true
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.deleteCartItem = (req,res,next) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    const product_id = obj.product_id;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: {id: product_id}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        });
    // Product.findById(product_id, (product) => {
    //     Cart.deleteProduct(product_id, product.price);
    //     res.redirect('/cart')
    // })
}

exports.postCart = (req,res,next) => {
    const obj = JSON.parse(JSON.stringify(req.body));
    const product_id = obj.product_id;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: {id: product_id}});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const productData = product.toJSON()
                const oldQuantity = productData.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(product_id)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                    through : { quantity : newQuantity}
            })
            .then(() => {
                res.redirect('/cart')
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        });
};


exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProduct(
                        products.map(product => {
                            product.orderItem = { quantity : product.cartItem.quantity};
                            return product
                        })
                    )
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err);
        })
    res.render('web/product/orders', {
        docTitle: 'Your Orders',
        path: '/orders',
        activeOrders: true,
    });
};

exports.getOrders = (req,res,next) => {
    req.user.getOrders({include: 'products'})
        .then(orders => {
            console.log(orders);
            res.render('web/product/orders', {
                docTitle: 'Your Orders',
                path: '/orders',
                activeOrders: true,
                orders: orders.map(order => order.toJSON()),
                hasOrders: orders.length > 0,
                activeWebOrder: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req,res,next) => {
    Product.findAll()
        .then(products => {
            res.render('web/product/product-list', {
                prods: products.map(product => product.toJSON()),
                docTitle: 'Products',
                path: '/products',
                hasProducts: products.length > 0,
                activeWebProduct: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req,res,next) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then(product => {
            console.log(product);
            res.render('web/product/product-detail', {
                prod: product.toJSON(),
                docTitle: 'Product Detail',
                path: `/products/${id}`,
                activeWebProduct: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getIndex = (req,res,next) => {
    Product.findAll()
        .then(products => {
            console.log('get Index: ',products);
            res.render('web/index', {
                prods: products.map(product => product.toJSON()),
                docTitle: 'Home',
                path: '/',
                hasProducts: products.length > 0,
                activeHome: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
};


