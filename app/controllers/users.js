var users = {};

users.index = function(req, res, next){
	console.log(req.params.username);
	res.render('users/index',{});
};

module.exports = users;