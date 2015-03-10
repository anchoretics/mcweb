var express = require('express');
var index = require('../controllers/index');
var user = require('../controllers/user');
var users = require('../controllers/users');
var poster = require('../controllers/poster');

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

	//用户操作
	app.get('/user/list', user.list);
	app.get('/user/new', user.new);
	app.get('/user/login', user.login);
	app.post('/user/login', user.doLogin);
	app.get('/user/logout', user.logout);


	//用户控制台
	app.get('/users/', user.authLogin, users.index);
	app.get('/users/info', user.authLogin, users.info);
	app.get('/users/loginlog', user.authLogin, users.loginlog);
	app.get('/users/chatlog', user.authLogin, users.chatlog);
	
	//插件提交数据
	app.post('/post/userlogin', poster.userlogin);
};