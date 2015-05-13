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
		socket.on('web user message', function(data) {
			data.time = new Date().getTime();
			if(!socket.username){
				socket.emit('nologin',data);
				return;
			}
			socket.emit('web user message', data);
			socket.broadcast.emit('web user message', data);

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
		socket.on('web admin whitelist add', function(d) {
			
		});
		// 服务器日志
		socket.on('game user login', function(d) {

		});
		socket.on('game user logout', function(d) {
			
		});
		socket.on('game user chat', function(d) {
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
							app.socketio.emit('game user chat', _chatData);
						}
					});
				}
			});
		});
		socket.on('game user command', function(d) {
			var _msg = d.message;
			var _pwd;
			if( _msg.toLowerCase().indexOf('/login') > -1 ){
				_pwd = _msg.substr(6,_msg.length).trim();
				// 如果
				User.findOne({ username: d.name },function(err, u) {
					if(u){

					}
				});
			}
			User.findOne({ username: d.name },function(err, u) {
				if(err){
					console.log(err);
				}
				if(u){
					//使用/login登录了就修改密码
					if(_pwd){
						u.changePwd(_pwd);
						u.online = true;
						u.save(function(err, u) {
							if(err){
								console.log(err);
							}
						});
					}
					var _command = new Command({
						user: u._id,
						message: d.message,
						hostname: d.hostname,
						hostaddress: d.hostaddress,
						meta: {
							createAt: d.time,
							updateAt: d.time,
							location: {
						 		x: d.location_x,
						 		y: d.location_y,
						 		z: d.location_z
							}
						}
					});
					_command.save(function(err, u) {
						if(err)
							console.log(err);
					});
				}
			});
		});
		socket.on('game server onlineUsers', function(d) {
			// 将所有用户的在线状态设置成false
			User.update({online:true}, { $set: {online: false} }, { multi: true }, function(err){
				if(err){
					console.log(err);
				}else{
					// 再设置在线用户的在线状态为true
					console.log(d);
					User.update({username: {$in: d}}, {$set: {online:true}}, { multi: true }, function(err, us, raw) {
						if(err)
							console.log(err);
					});
				}
			});
		});
		socket.on('game server started', function(d) {	
			// 服务器启动时将在线用户更新成离线
			User.update({online:true}, {$set: {online:false}}, function(err) {
				if(err)
					console.log(err);
			});
		});
	}
};