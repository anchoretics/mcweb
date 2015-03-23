var socketio = require('socket.io');


module.exports = function(server, app){
	var io = new socketio(server);
	app.socketio = io;
	io.on('connection', function(socket){

		socket.on('new web message', function(data) {
			console.log(data);
			socket.emit('web message', data);
			socket.broadcast.emit('web message', data);
		});
		socket.on('login', function(username){
			socket.username = username;
			socket.broadcast.emit('user join', { username: socket.username, msg: '进入网站聊天室' });
		});
		socket.on('disconnect', function(data){
			socket.broadcast.emit('user left', { username: socket.username, msg: '离开网站聊天室' });
		});
	});
};