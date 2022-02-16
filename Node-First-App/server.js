const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');
const app = express();

const sequelize = require('./util/database');

const User = require('./models/user');
const Product = require('./models/product');

const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');




// Setting up body parser
app.use(bodyParser.urlencoded({extended: false}));
// Serving files statically
app.use(express.static(path.join(__dirname,'public')));
//Using handleBars Engine
app.engine('hbs',expressHbs({
    layoutsDir:'views/layouts',
    partialsDir: 'views/partials',
    defaultLayout:'master',
    extname:'hbs',
    helpers: {
        mult: function (a, b) {
            return a * b;
        }
    }
}));

app.set('view engine', 'hbs');
// Using Pug Engine
// app.set('view engine', 'pug');
app.set('views', 'views');

// app.use('/',(req,res,next) => {
//     console.log('First Middleware');
//     next();
// });
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

app.use('/admin',adminRoutes);
app.use(webRoutes);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
sequelize
    // .sync({ force: true})
    .sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({
                username: "yenum",
                email: "yenum@yenum.dev"
            })
        }
        return user;
    })
    .then(user => {
        // console.log("user : ", user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
// app.use((req, res, next ) => {
//     res.status(404).sendFile(path.join(__dirname, './', 'views', '404.html'));
//     // res.status(404).send('<h1>404 Page Not Found</h1>')
// });
