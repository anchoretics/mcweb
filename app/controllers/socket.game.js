var Chat = require('../models/chat');
var User = require('../models/user');
var Login = require('../models/login');
var Command = require('../models/command');

module.exports = {
	chat: function(socket, io, data) {
		User.findOne({username: data.name},function(err, u) {
			if(u){
				var _chatData = {
					message: data.msg,
					hostname: data.hostname,
					hostaddress: data.hostaddress,
					source: 'game',
					user: u._id,
					meta: {
						createAt: data.time,
						updateAt: data.time,
						location: {
					 		x: data.x,
					 		y: data.y,
					 		z: data.z
						}
					}
				};
				var _chat = new Chat(_chatData);
				_chat.save(function(err, d) {
					if(err){
						console.log(err);
					}else{
						// 广播到web
						_chatData.type = io.MsgType.CHAT;
						_chatData.username = u.username;
						io.emit(io.WEB_NAME, _chatData);
					}
				});
			}
		});
	},
	login : function(socket, io, data){
		User.findOne({username: data.name},function(err, u) {
			//没有的user先增加
			if(u){
				u.online = true;
				u.meta.lastloginAt = data.time;
				u.meta.lastlocation = {
			 		x: data.x,
			 		y: data.y,
			 		z: data.z
				};
				u.meta.lasthostaddress = data.hostaddress;
				u.save(function(err) {
					if(err){
						console.log(err);
					}
					else{
						module.exports.saveLoginLog(data, u);
						io.emit(io.WEB_NAME, {type: io.MsgType.LOGIN, username: socket.username, msg: '进入游戏' });
					}
				});
			}else{
				var _user = new User({
					username: data.name,
					customname: data.customname,
					displayname: data.displayname,
					name: data.name,
					listname: data.listname,
					allowfly: data.allowfly == 'true',
					world: data.world,
					gamemode: data.gamemode,
					password: '123456',
					online: true,
					meta: {
						createAt: data.time,
						updateAt: data.time,
						lastloginAt: data.time,
					 	lastlocation: {
					 		x: data.x,
					 		y: data.y,
					 		z: data.z
					 	},
					 	lasthostaddress: data.hostaddress
					}
				});
				_user.save(function(err) {
					if(err){
						console.log(err);
					}else{
						module.exports.saveLoginLog(data, _user);
						io.emit(io.WEB_NAME, {type: io.MsgType.LOGIN, username: socket.username, msg: '进入游戏' });
					}
				});
			}
		});
	},
	logout: function(socket, io, data) {
		//查询用户
		User.findOne({ username: data.name },function(err, u) {
			if(u){
				u.online = false;
				u.save();
				module.exports.saveLoginLog(data, u);
				io.emit(io.WEB_NAME, { username: socket.username, msg: '离开游戏' });
				console.log('time used: ', new Date().getTime() - io.t1);
			}
		});
	},
	command: function(socket, io, data) {
		//查询用户
		User.findOne({ username: data.name },function(err, u) {
			if(err){
				console.log(err);
			}
			if(u){
				var _command = new Command({
					user: u._id,
					message: data.message,
					hostname: data.hostname,
					hostaddress: data.hostaddress,
					meta: {
						createAt: data.time,
						updateAt: data.time,
						location: {
					 		x: data.x,
					 		y: data.y,
					 		z: data.z
						}
					}
				});
				_command.save(function(err, u) {
					if(err){
						console.log(err);
					}
				});
			}
		});
	},
	server_start: function() {
		// 服务器启动时将在线用户更新成离线
		User.update({}, {$set: {online:false}}, { multi: true }, function(err) {
			if(err)
				console.log(err);
		});
	},
	server_onlineusers: function(socket, io, data) {
		// 将所有用户的在线状态设置成false
		User.update({}, { $set: {online: false} }, { multi: true }, function(err){
			if(err){
				console.log(err);
			}else{
				// 再设置在线用户的在线状态为true
				User.update({username: {$in: data.users}}, {$set: {online:true}}, { multi: true }, function(err, raw) {
					if(err)
						console.log(err);
				});
			}
		});
	},

	saveLoginLog: function(data, u) {
		var _login = new Login({
			type: data.type,
			user: u ? u._id : null,
			message: data.msg,
			hostname: data.hostname,
			hostaddress: data.hostaddress,
			source: '游戏',
			meta: {
				createAt: data.time,
				updateAt: data.time,
				location: {
			 		x: data.x,
			 		y: data.y,
			 		z: data.z
				}
			}
		});
		_login.save(function(err, d) {
			if(err)
				console.log(err);
		});
	}
};