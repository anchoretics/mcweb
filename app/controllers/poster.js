var Chat = require('../models/chat');
var Login = require('../models/login');
var Command = require('../models/command');
var User = require('../models/user');

var poster = {};
poster.post = function(req, res, next){
	var _type = req.body.type;
	var _data = req.body;
	//坐标保留一位小数点
	_data.location_x = Math.round(_data.location_x*10)/10;
	_data.location_y = Math.round(_data.location_y*10)/10;
	_data.location_z = Math.round(_data.location_z*10)/10;
	switch(_type){
		case 'chat':
			poster.saveChat(null,req.body,res);
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
		default:
			break;
	}
};
poster.saveChat = function(err, d, res) {
	User.findOne({username: d.name},function(err, u) {
		if(u){
			var _chat = new Chat({
				message: d.message,
				format: d.format,
				hostname: d.hostname,
				hostaddress: d.hostaddress,
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
			});
			_chat.save(function(err, d) {
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

module.exports = poster;