module.exports = {

	chat: function(socket, io, data){
		User.findOne({username: data.username},function(err, u) {
			if(u){
				var _chatData = {
					message: data.message,
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
						_chatData.username = u.username;
						socket.broadcast.emit(io.WEB_NAME, _chatData);
					}
				});
			}
		});
	},
	login: function(socket, io, data) {
		User.findOne({username: data.name},function(err, u) {
			//没有的user先增加
			if(u){
				u.online = true;
				u.meta.lastloginAt = data.time;
				u.meta.lastlocation = {
			 		x: 0,
			 		y: 0,
			 		z: 0
				};
				// 获取用户ip地址
				//u.meta.lasthostaddress = d.hostaddress;
				u.save();
				module.exports.saveLoginLog(data, u);
				socket.username = data.username;
				socket.userID = data.userID;
				io.emit(io.WEB_NAME, { username: socket.username, msg: '进入聊天室' });
			}
		});
	},
	getOnlineUsers: function(socket, io){
		socket.broadcast.emit(io.WEB_NAME, {users: []});
	},
	saveLoginLog: function(data, u) {
		var _login = new Login({
			type: data.type,
			user: (u === null) ? null : u._id,
			message: data.msg,
			hostname: data.hostname,
			hostaddress: data.hostaddress,
			source: '网站',
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
			if(err){
				console.log(err);
			}
		});
	}
};