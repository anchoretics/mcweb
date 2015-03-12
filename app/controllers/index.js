var index = {};
var moment = require('moment');
index.index = function(req, res, next) {
	
	res.render('index', { title: '首页'});
};

module.exports = index;