var user = {};
var User = require('../models/user');

var data = { 
	title:'用户列表', 
	users: [
		{
			username:'张三',
			pwd:'******'
		},{
			username:'李四',
			pwd:'******'
		} 
	]
};

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
                req.login(_user,function(err) {
                    if (err) {
                        return next(err);
                    }
                    if(_user.remember_me){
                        var hour = 3600000;
                        var year = hour * 24 * 365;
                        req.session.cookie.expires = new Date(Date.now() + year);
                        req.session.cookie.maxAge = year;
                    }
                    return res.redirect('/users/' + encodeURIComponent(req.user.username));
                });
            }
    	}
    });
};

user.login = function(req, res, next){
	res.render('user/login',{title:'登录'});
};
user.list = function(req, res, next){
	res.render('user/list',data);
};
user.new = function(req, res, next){
    var _user = new User({
        username: "mc",
        password: "123456"
    });
    _user.save();
	res.render('new',{title:'新增用户'});
};
user.save = function(req, res, next){
	//
};

user.logout = function(req, res, next){
    req.logout();
    delete req.app.locals.user;
    res.redirect('/');
};

user.authLogin = function(req, res, next){
    if(!req.session.passport.user){
        res.render('user/login',{error: '你需要登录才能操作!'});
    }else if(req.session.passport.user.username != req.params.username){
        //禁止访问别的username
        res.redirect('/users/' + req.session.passport.user.username);
    }else{
        next();
    }
};

module.exports = user;