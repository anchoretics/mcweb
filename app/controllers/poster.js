var poster = {};
poster.post = function(req, res, next){
	console.log('poste data :');
	console.log(req.body);
	res.end();
};
module.exports = poster;