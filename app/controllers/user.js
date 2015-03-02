var user = {};

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
    req.login(_user,function(err) {
		if (err) {
			return next(err);
		}
		return res.redirect('/users/' + encodeURIComponent(req.user.username));
    });
};

user.login = function(req, res, next){
	res.render('user/login',{title:'登录'});
};
user.list = function(req, res, next){
	res.render('user/list',data);
};
user.new = function(req, res, next){
	res.render('user_new',{title:'新增用户'});
};
user.save = function(req, res, next){
	//
};

user.logout = function(req, res, next){
    req.logout();
    delete req.app.locals.user;
    res.redirect('/');
};

module.exports = user;