var socketio = require('socket.io');
var Chat = require('../models/chat');
var User = require('../models/user');

module.exports = function(server, app){
	var io = new socketio(server);
	app.socketio = io;
	io.on('connection', function(socket){

		socket.on('new web message', function(data) {

			socket.emit('web message', data);
			socket.broadcast.emit('web message', data);

			new Chat({
				user: socket.userID,
				message: data.msg,
				hostname: data.ip,
				hostaddress: data.ip,
				meta: {
					createAt: data.time,
					updateAt: data.time,
					location: {
				 		x: 0,
				 		y: 0,
				 		z: 0
					}
				}
			}).save();
		});
		socket.on('login', function(data){
			socket.username = data.username;
			socket.userID = data.userID;
			socket.broadcast.emit('user join', { username: socket.username, msg: '进入网站聊天室' });
		});
		socket.on('disconnect', function(data){
			//判断是否有username，有则说明是正常的连接，否则可能是因为断开连接但是网页没关闭引起的username为undefined
			if(socket.username){
				socket.broadcast.emit('user left', { username: socket.username, msg: '离开网站聊天室' });
			}
		});
	});
};