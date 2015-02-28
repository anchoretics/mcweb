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

user.login = function(req, res, next){
	res.render('user/login',data);
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

module.exports = user;