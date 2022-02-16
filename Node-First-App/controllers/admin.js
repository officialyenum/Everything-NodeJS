const Product = require("../models/product");

let product;

exports.getAddProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/add-product', {
                prods: products.map(product => product.toJSON()),
                docTitle: 'Admin Add Product',
                path: '/admin/add-product',
                hasProducts: products.length > 0,
                activeAddProduct: true,
                formCSS: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getEditProducts = (req, res, next) => {
    // const editMode = req.query.edit; // For Using Query params 
    const id = req.params.id;
    Product.findByPk(id)
        .then(product => {
            res.render('admin/edit-product', {
                product: product.toJSON(),
                docTitle: 'Admin Edit Product',
                path: '/admin/edit-product',
                activeProduct: true,
                formCSS: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
    // res.sendFile(path.join(rootDir, 'views', 'edit-product.html'));
    
}

exports.getProducts = (req, res, next) => {
    // console.log('Add Product Form');
    Product.findAll()
        .then(products => {
            res.render('admin/product-list', {
                prods: products.map(product => product.toJSON()),
                docTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
                activeProduct: true,
                formCSS: true,
                productCSS: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.postAddProducts = (req, res, next) => {
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
    console.log(obj); // { title: 'product' }
    req.user.createProduct({
        title: obj.title,
        imageUrl: obj.imageUrl,
        price: obj.price,
        description: obj.description
    })
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
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
    // console.log(obj); // { title: 'product' }
    // product = new Product(obj.id, obj.title, obj.imageUrl, obj.description, obj.price);
    // product.save();
    Product.findByPk(obj.id)
        .then(product => {
            product.title = obj.title;
            product.imageUrl = obj.imageUrl;
            product.description = obj.description;
            product.price = obj.price;
            return product.save();
        })
        .then(result => {
            console.log('Product Updated : ',result.toJSON());
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        });
    // products.push(obj);
};

exports.postDeleteProducts = (req, res, next) => {
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
    // console.log(obj); // { title: 'product' }
    Product.findByPk(obj.productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Product Deleted : ',result.toJSON());
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err);
        });
    // products.push(obj);
};