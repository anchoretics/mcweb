var socketio = require('socket.io');


module.exports = function(server){
	var io = new socketio(server);
	io.on('connection', function(socket){
		socket.on('login', function(data){
			console.log(data);
			socket.username = data;
			socket.emit('welcome',{msg: 'welcome ' + socket.username});
			socket.broadcast.emit('welcome',{msg: 'user ' + socket.username + ' login in'});
		});
	});
};