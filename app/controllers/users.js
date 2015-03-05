var users = {};

users.index = function(req, res, next){
	res.render('users/index',{});
};
users.info = function(req, res, next){
	var data = {
	};
	res.render('users/info',data);
};
users.loginlog = function(req, res, next){
	res.render('users/loginlog',{});
};
users.chatlog = function(req, res, next){
	res.render('users/chatlog',{});
};


module.exports = users;