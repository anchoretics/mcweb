var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer  = require('multer');
var moment = require('moment');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var app = express();
//var session2 = require('express-session');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var connStr = 'mongodb://mc:123456@127.0.0.1/minecraft';
mongoose.connect(connStr);
// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './app/uploads/'}));
app.use(cookieParser());
app.use(session({
    name: 'SESSIONID',
    secret: 'minecraft',
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
//自定义认证策略
passport.use(new LocalStrategy(
  function(username, password, done) {
    var _user = {
        id: '1',
        username: 'admin',
        password: '123456'
    }; // 可以配置通过数据库方式读取登陆账号

    if (username !== _user.username) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (password !== _user.password) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, _user);
  }
));

app.post('/user/login', passport.authenticate('local', 
    {
        successRedirect: '/',
        failureRedirect: '/user/login'
    }
));

passport.serializeUser(function (user, done) {//保存user对象
    //req.session.user = user;
    done(null, user);//可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) {//删除user对象
    //req.session.user = null;
    done(null, user);//可以通过数据库方式操作
});

var routes = require('./app/routes/routes.js')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('您访问的网页不见了');
    err.status = 404;
    next(err);
});

//
//app.set('env','production');

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = true;
    console.log('debug mode');
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
