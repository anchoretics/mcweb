var index = {};
index.index = function(req, res, next) {
	res.render('index', { title: '首页'});
};

module.exports = index;