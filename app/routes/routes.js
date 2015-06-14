var express = require('express');
var index = require('../controllers/index');
var user = require('../controllers/user');
var whitelist = require('../controllers/op/whitelist');
var mcServer = require('../controllers/op/server');
var moment = require('moment');
var socket = require('socket.io');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

	// 将user对象设置到locals
	app.use(function(req, res, next) {
	  	res.locals.user = req.session.passport.user || null;
	    next();
	});
	//首页
	app.get('/', index.index);
	app.get('/download', function(req, res){
		res.render('download');
	});

	//用户管理
	app.get('/user/list', user.list);
	app.get('/user/online', user.online);
	app.get('/user/login', user.login);
	app.post('/user/login', user.doLogin);
	app.get('/user/logout', user.logout);

	app.get('/user/', user.authLogin, user.index);
	app.get('/user/info', user.authLogin, user.info);
	app.get('/user/loginlog', user.authLogin, user.loginlog);
	app.get('/user/chatlog', user.authLogin, user.chatlog);
	app.get('/user/commandlog', user.authLogin, user.commandlog);
	app.get('/user/update', user.authLogin, user.update);
	app.get('/user/demo', user.demo);

	//聊天室
	app.get('/user/chatroom', user.authLogin, user.chatroom);
	
	// op 管理
	app.get('/op/whitelist', user.authLogin, user.authOp, whitelist.list);
	app.post('/op/whitelist', user.authLogin, user.authOp, whitelist.add);
	app.post('/op/whitelist/remove', user.authLogin, user.authOp, whitelist.remove);

	app.get('/op/server', user.authLogin, user.authOp, mcServer.index);
	app.post('/op/server/restart', user.authLogin, user.authOp, mcServer.restart);


	app.locals.helper = {
		time2string: function(obj,format){
			if(!format){
				format = 'YYYY-MM-DD HH:mm:ss';
			}
			if(obj){
				return moment(new Date(obj)).format(format);
			}
		}
	};


};