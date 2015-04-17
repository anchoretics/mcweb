var socketio = require('socket.io');
var socketController = require('../app/controllers/socket.io.js');

module.exports = function(server, app){
	var io = new socketio(server);
	app.socketio = io;
	
	io.on('connection', socketController.connection);
};