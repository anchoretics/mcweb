var Chat = require('../models/chat');
var Login = require('../models/login');
var Command = require('../models/command');
var User = require('../models/user');

var user = {};

user.doLogin = function(req, res, next){
    var _user = req.body;
    User.findOne({'username': _user.username}, function(err, u){
    	if(err)
    		console.log(err);
    	if(!u){
            res.render('user/login',{error:'用户不存在!'});
        }
    	else{
    		if(!u.comparePwd(_user.password)){
                res.render('user/login',{error:'密码不正确!'});
            }else{
                _user.password = null;
                req.login(u,function(err) {
                    if (err) {
                        return next(err);
                    }
                    if(_user.remember_me){
                        var hour = 3600000;
                        var year = hour * 24 * 365;
                        req.session.cookie.expires = new Date(Date.now() + year);
                        req.session.cookie.maxAge = year;
                    }
                    res.redirect('/user/info');
                });
            }
    	}
    });
};

user.login = function(req, res, next){
	res.render('user/login',{title:'登录'});
};
user.list = function(req, res, next){
    User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
            if (err) return next(err);
            console.log(pageCount+','+itemCount);
            res.render('user/list', {
                users: users,
                currentPage: req.query.page || 1,
                pageCount: pageCount,
                itemCount: itemCount
        });
    },{ columns:null,populate:null,sortBy: 'username' });
};

user.online = function(req, res, next){
    User.paginate({online: true}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
            if (err) return next(err);
            console.log(pageCount+','+itemCount);
            res.render('user/online', {
                users: users,
                currentPage: req.query.page || 1,
                pageCount: pageCount,
                itemCount: itemCount
        });
    },{ columns:null,populate:null,sortBy: 'username' });
};
user.save = function(req, res, next){
	//
};

user.logout = function(req, res, next){
    req.logout();
    delete req.app.locals.user;
    res.redirect('/');
};

user.index = function(req, res, next){
    res.redirect('/user/info');
};
user.info = function(req, res, next){
    var data = {
    };
    res.render('user/info',data);
};
user.loginlog = function(req, res, next){
    var _q = {};
    if(!req.user.op){
        _q.user = req.user._id;
    }
    Login.paginate(_q, req.query.page, req.query.limit, function(err, pageCount, logs, itemCount) {
            if (err) return next(err);
            console.log(pageCount+','+itemCount);
            res.render('user/loginlog', {
                logs: logs,
                currentPage: req.query.page || 1,
                pageCount: pageCount,
                itemCount: itemCount
        });
    },{ columns:null,populate:{ path:'user', select: 'username'},sortBy: '-meta.createAt' });
};

user.chatlog = function(req, res, next){
    Chat.paginate({}, req.query.page, req.query.limit, function(err, pageCount, logs, itemCount) {
            if (err) return next(err);
            console.log(pageCount+','+itemCount);
            res.render('user/chatlog', {
                logs: logs,
                currentPage: req.query.page || 1,
                pageCount: pageCount,
                itemCount: itemCount
        });
    },{ columns:null,populate:{ path:'user', select: 'username'},sortBy: '-meta.createAt' });
};

user.commandlog = function(req, res, next){
    var _q = {};
    if(!req.user.op){
        _q.user = req.user._id;
    }
    Command.paginate(_q, req.query.page, req.query.limit, function(err, pageCount, logs, itemCount) {
            if (err) return next(err);
            console.log(pageCount+','+itemCount);
            res.render('user/commandlog', {
                logs: logs,
                currentPage: req.query.page || 1,
                pageCount: pageCount,
                itemCount: itemCount
        });
    },{ columns:null,populate:{ path:'user', select: 'username'},sortBy: '-meta.createAt' });
};

user.update = function(req, res, next){
    
};

user.authLogin = function(req, res, next){
    if(!req.session.passport.user){
        res.render('user/login',{error: '你需要登录才能操作! 用户名密码是你登录游戏的用户名密码'});
    }else{
        next();
    }
};

module.exports = user;