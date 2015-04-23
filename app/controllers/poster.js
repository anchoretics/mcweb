var Chat = require('../models/chat');
var Login = require('../models/login');
var Command = require('../models/command');
var User = require('../models/user');

var poster = {};
poster.post = function(req, res, next){
	var _type = req.body.type;
	var _data = req.body;
	//处理坐标，只保留一位小数点
	if(_data.location_x && _data.location_y && _data.location_z){
		_data.location_x = Math.round(_data.location_x*10)/10;
		_data.location_y = Math.round(_data.location_y*10)/10;
		_data.location_z = Math.round(_data.location_z*10)/10;
	}
	switch(_type){
		case 'chat':
			poster.saveChat(null,req.body,req,res);
			break;
		case 'login':
			poster.saveLogin(null,req.body,res);
			break;
		case 'logout':
			poster.saveLogin(null,req.body,res);
			break;
		case 'command':
			poster.saveCommand(null,req.body,res);
			break;
		case 'onlineUsers':
			poster.saveOnlineUsers(null, req, res);
			break;
		case 'serverStarted':
			poster.serverStarted(null, res);
			break;
		default:
			res.end();
			break;
	}
};

poster.saveChat = function(err, d, req, res) {
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
					req.app.socketio.emit('posted message', _chatData);
				}
				res.end();
			});
		}else{
			res.end();
		}
	});

};

poster.saveLogin = function(err, d, res) {
	User.findOne({username: d.name},function(err, u) {
		//没有的user先增加
		if(u){
			if(d.type == 'logout'){
				u.online = false;
			}else{
				u.online = true;
			}
			u.meta.lastloginAt = d.time;
			u.meta.lastlocation = {
		 		x: d.location_x,
		 		y: d.location_y,
		 		z: d.location_z
			};
			u.meta.lasthostaddress = d.hostaddress;
			u.save(function(err, u) {
				poster.saveLoginLog(err, d, res, u);
			});
		}else{
			var _user = new User({
				username: d.name,
				customname: d.customname,
				displayname: d.displayname,
				name: d.name,
				listname: d.listname,
				allowfly: d.allowfly == 'true',
				world: d.world,
				gamemode: d.gamemode,
				password: '123456',
				online: true,
				meta: {
					createAt: d.time,
					updateAt: d.time,
					lastloginAt: d.time,
				 	lastlocation: {
				 		x: d.location_x,
				 		y: d.location_y,
				 		z: d.location_z
				 	},
				 	lasthostaddress: d.hostaddress
				}
			});
			_user.save(function(err, u) {
				if(err){
					console.log(err);
				}else{
					poster.saveLoginLog(err, d, res, u);
				}
			});
		}
	});
};

poster.saveCommand = function(err, d, res) {
	var _msg = d.message;
	var _pwd;
	if( _msg.toLowerCase().indexOf('/login') > -1 ){
		_pwd = _msg.substr(6,_msg.length).trim();
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
				if(err){
					console.log(err);
				}
				res.end();
			});
		}else{
			res.end();
		}
	});
};

poster.saveLoginLog = function(err, d, res, u) {
	var _login = new Login({
		type: d.type,
		user: (u === null) ? null : u._id,
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
	_login.save(function(err, d) {
		if(err){
			console.log(err);
		}
		res.end();
	});
};

poster.saveOnlineUsers = function(err, req, res){
	if(req.body && req.body.username){
		// 将所有用户的在线状态设置成false
		User.update({online:true}, { $set: {online: false} }, function(err){
			if(err){
				console.log(err);
			}else{
				// 再设置在线用户的在线状态为true

				var q_users = [];
				if(typeof(req.body.username)=='string'){
					q_users.push(req.body.username);
				}else{
					q_users = req.body.username;
				}

				User.update({username: {$in: q_users}}, {$set: {online:true}}, function(err) {
					if(err)
						console.log(err);
					res.end();
				});
			}
		});
	}else{
		req.app.socketio.emit('onlineUsers', req.body);
		res.end();
	}

};

poster.serverStarted = function(err, res){
	// 服务器启动时将在线用户更新成离线
	User.update({online:true}, {$set: {online:false}}, function(err) {
		if(err)
			console.log(err);
		res.end();
	});
};
module.exports = poster;