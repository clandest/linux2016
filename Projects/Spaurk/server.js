
var express     = require('express'),
    app         = express(),
    port        = process.env.PORT || 8080,
    mongoose    = require('mongoose'),
    passport    = require('passport'),
    flash       = require('connect-flash');

var cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    multer          = require('multer'),
    upload          = multer({ dest: 'uploads/' }),
    session         = require('express-session');

var configDb = require('./config/database.js');
mongoose.connect(configDb.url);

require('./config/passport')(passport);

app.use(session({ secret : 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cookieParser());
app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('views/static/'));
app.set('view engine', 'ejs');
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
