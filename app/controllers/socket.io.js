var socketio = require('socket.io');
var Chat = require('../models/chat');
var User = require('../models/user');
var Login = require('../models/login');
var Command = require('../models/command');
var app = require('../../app.js');

module.exports = {

	connection: function(socket){
		// 在线聊天
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
		socket.on('new web message', function(data) {
			if(!socket.username){
				socket.emit('nologin',data);
				return;
			}
			socket.emit('web message', data);
			socket.broadcast.emit('web message', data);

			new Chat({
				user: socket.userID,
				message: data.msg,
				hostname: data.ip,
				hostaddress: data.ip,
				source: 'web',
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
		// 在线管理
		socket.on('web whitelist add', function(d) {
			
		});
		// 服务器日志
		socket.on('server login', function(d) {

		});
		socket.on('server logout', function(d) {
			
		});
		socket.on('server chat', function(d) {
			console.log(d);

			User.findOne({username: d.name},function(err, u) {
				if(u){
					var _chatData = {
						message: d.message,
						format: d.format,
						hostname: d.hostname,
						hostaddress: d.hostaddress,
						source: 'game',
						user: u._id,
						meta: {
							createAt: d.time,
							updateAt: d.time,
							location: {
						 		x: d.location_x,
						 		y: d.location_y,
						 		z: d.location_z
							}
						}
					};
					var _chat = new Chat(_chatData);
					_chat.save(function(err, d) {
						if(err){
							console.log(err);
						}else{
							// 广播到web
							_chatData.username = u.username;
							app.socketio.emit('game chat', _chatData);
						}
					});
				}
			});
		});
		socket.on('server command', function(d) {
			
		});
		socket.on('server onlineUsers', function(d) {
			
		});
		socket.on('server serverStarted', function(d) {
			
		});
	}
};