var Chat = require('../models/chat');
var User = require('../models/user');
var Login = require('../models/login');

module.exports = {

	chat: function(socket, io, data){
		var time = new Date().getTime();
		var _chatData = {
			message: data.msg,
			hostname: data.hostname,
			hostaddress: socket.client.conn.remoteAddress,
			source: '网站',
			user: socket.userID,
			meta: {
				createAt: time,
				updateAt: time
			}
		};
		var _chat = new Chat(_chatData);
		_chat.save(function(err) {
			if(err){
				console.log(err);
			}else{
				// 广播到web
				_chatData.username = socket.username;
				_chatData.type = io.MsgType.CHAT;
				console.log('chat: ', _chatData.message);
				io.emit(io.WEB_NAME, _chatData);
				io.emit(io.GAME_NAME, _chatData);
			}
		});
	},
	login: function(socket, io, data) {
		User.findOne({username: data.username},function(err, u) {
			//没有的user先增加
			if(u){
				var _time = new Date().getTime();
				u.online = true;
				u.meta.lastloginAt = _time;
				// 获取用户ip地址
				u.meta.lasthostaddress = socket.client.conn.remoteAddress;
				u.save();
				data.time = _time;
				//module.exports.saveLoginLog(socket, data, u);
				socket.username = data.username;
				socket.userID = data.userID;
				io.addOnlineUser(data.username);
				io.emit(io.WEB_NAME, {type: io.MsgType.LOGIN, username: socket.username, message: '进入聊天室' });
				io.emit(io.GAME_NAME, {type: io.MsgType.LOGIN, username: socket.username });
			}
		});
	},
	getOnlineUsers: function(socket, io){
		User.find({online: true}, 'username', function(err, users) {
			users.forEach(function(el, index){
				io.addOnlineUser(el.username);
			});
			socket.emit(io.WEB_NAME, {type: io.MsgType.ONLINEUSERS, users: io.onlineUsers});
		});
	}
};