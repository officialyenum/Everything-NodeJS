const Product = require("../models/product");

let product;

exports.getAddProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            console.log(rows[0]);
            res.render('admin/add-product', {
                prods: rows,
                docTitle: 'Admin Add Product',
                path: '/admin/add-product',
                hasProducts: rows.length > 0,
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
    Product.findById(id, product => {
        res.render('admin/edit-product', {
            product: product,
            docTitle: 'Admin Edit Product',
            path: '/admin/edit-product',
            activeProduct: true,
            formCSS: true,
            productCSS: true
        });
    })
    // res.sendFile(path.join(rootDir, 'views', 'edit-product.html'));
    
}

exports.getProducts = (req, res, next) => {
    // console.log('Add Product Form');
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('admin/product-list', {
                prods: rows,
                docTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: rows.length > 0,
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
    product.save()
        .then(() => {
            res.redirect('/')
        })
        .catch(err => {
        console.log(err);
    });
    // products.push(obj);
};

exports.postEditProducts = (req, res, next) => {
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
    // console.log(obj); // { title: 'product' }
    product = new Product(obj.id, obj.title, obj.imageUrl, obj.description, obj.price);
    product.save();
    // products.push(obj);
    res.redirect('/admin/products')
};

exports.postDeleteProducts = (req, res, next) => {
    const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'yenum' }
    // console.log(obj); // { title: 'product' }
    Product.deleteById(obj.productId)
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => {
        console.log(err);
    });
    // products.push(obj);
};