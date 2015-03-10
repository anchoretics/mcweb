var poster = {};
poster.userlogin = function(req, res, next){
	console.log('poster userlogin :');
	console.log(req.body);
	res.end();
};
module.exports = poster;