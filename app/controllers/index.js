var index = {};
index.index = function(req, res, next) {
	console.log(req.session);
	res.render('index', { title: '首页'});
};

module.exports = index;