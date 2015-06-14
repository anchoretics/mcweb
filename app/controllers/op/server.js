
var app = require('../../../app');
var server = {
	index: function(req, res){
		res.render('op/server');
	}
};

server.restart = function(req, res){
    var io = app.socketio;
    io.emit(io.GAME_NAME, {type: io.MsgType.COMMAND, token: io.token, message: 're restart time 1' });
    res.end('success');
};

module.exports = server; 