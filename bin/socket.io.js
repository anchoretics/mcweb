var socketio = require('socket.io');
var webController = require('../app/controllers/socket.web');
var gameController = require('../app/controllers/socket.game');



module.exports = function(server){

	var io = new socketio(server);
	io.token = '2fsaakEAk3';
	io.WEB_NAME = 'webMessage';
	io.GAME_NAME = 'gameMessage';
	io.onlineUsers = [];
	io.addOnlineUser = function(username){
		//查询在线用户列表，当没有该用户的时候再添加
		var _index = -1;
		io.onlineUsers.forEach(function(el, index){
			if(el == username){
				_index = index;
			}
		});
		if(_index == -1){
			io.onlineUsers.push(username);
		}
	};
	io.delOnlineUser = function(username){
		io.onlineUsers.forEach(function(el, index){
			if(el == username){
				//删除index开始的1个元素
				io.onlineUsers.splice(index,1);
			}
		});
	};
	io.MsgType = {
		CHAT : 'chat',
		LOGIN : 'login',
		LOGOUT : 'logout',
		ONLINEUSERS: 'onlineUsers'
	};
	io.on('connection', function(socket) {
		//消息分为两种，web端和游戏服务端
		//webMessage/gameMessage
		//网页端消息
		console.log('socket connected :', io.token);
		socket.on(io.WEB_NAME, function(d) {
			console.log('on webMessage: ', d);
			var type = d.type || '';
			// 登录
			if(type == io.MsgType.LOGIN){
				webController.login(socket, io, d);
				webController.getOnlineUsers(socket, io);
			}else if(!socket.username || !socket.userID){
				socket.emit(io.WEB_NAME, {type: 'nologin', data: d});
			}else{
				switch(type){
					case io.MsgType.CHAT:
						webController.chat(socket, io, d);
						break;
					case io.MsgType.LOGIN:
						webController.login(socket, io, d);
						break;
					case io.MsgType.ONLINEUSERS:
						webController.getOnlineUsers(socket, io);
						break;
					default:break;
				}
			}
		});

		//游戏服务器端消息
		socket.on(io.GAME_NAME, function(d) {
			console.log('on gameMessage: ', d);
			io.t1 = new Date().getTime();
			var token = d.token || false;
			if(!token || token != io.token){
				console.log('no token, socket will disconnect');
				socket.disconnect();
				return false;
			}
			console.log('token: ', token);
			var type = d.type || '';
			switch(type){
				case 'chat':
					gameController.chat(socket, io, d);
					break;
				case 'login':
					gameController.login(socket, io, d);
					break;
				case 'logout':
					gameController.logout(socket, io, d);
					break;
				case 'register':
					gameController.register(socket, io, d);
					break;
				case 'unregister':
					gameController.unregister(socket, io, d);
					break;
				case 'command':
					gameController.command(socket, io, d);
					break;
				case 'server_start':
					gameController.server_start(socket, io, d);
					break;
				case 'server_onlineusers':
					gameController.server_onlineusers(socket, io, d);
					break;
				default:
					console.log('socket type not matched, socket will disconnect');
					socket.disconnect();
					break;
			}
		});
		//用户断开事件
		socket.on('disconnect', function(data){
			console.log('socket disconnect');
			//判断是否有username，有则说明是正常网页用户的连接，否则可能是因为断开连接但是网页没关闭引起的username为undefined，或者是服务器
			if(socket.username){
				io.delOnlineUser(socket.username);
				socket.broadcast.emit(io.WEB_NAME, {type: io.MsgType.LOGOUT, username: socket.username, msg: '离开聊天室' });
				socket.broadcast.emit(io.GAME_NAME, {type: io.MsgType.LOGOUT,token: io.token, username: socket.username, msg: '离开聊天室' });
			}
		});
	});
};