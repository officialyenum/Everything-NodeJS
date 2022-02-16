const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');
const app = express();

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

app.use('/admin',adminRoutes);
app.use(webRoutes);

app.listen(3000);
// app.use((req, res, next ) => {
//     res.status(404).sendFile(path.join(__dirname, './', 'views', '404.html'));
//     // res.status(404).send('<h1>404 Page Not Found</h1>')
// });
