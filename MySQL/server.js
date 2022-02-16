const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const db = require('./util/database');

const app = express();

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


const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');

app.use('/admin',adminRoutes);
app.use(webRoutes);


app.listen(3000);
