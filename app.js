var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer  = require('multer');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);

var app = express();
var paginate = require('express-paginate');
app.use(paginate.middleware(15, 100));
var config = require('./config.json');
var passport = require('passport');

var db = mongoose.connect(config.dburl,function(err){
    if(err)
        console.log(err);
});
db.connections[0].on('error', console.error.bind(console, 'connect error: '));
db.connections[0].once('open', function(){
    console.log('mongodb connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/app/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ dest: './app/uploads/'}));
app.use(cookieParser());
app.use(session({
    name: 'SESSIONID',
    secret: 'mc',
    cookie: {
        //maxAge: 10000
    },
    store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 60*60  //1小时。单位：秒
        }
    ),
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'app/public')));

//加载passport功能
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});


module.exports = app;
