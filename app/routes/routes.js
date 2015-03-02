var express = require('express');
var index = require('../controllers/index');
var user = require('../controllers/user');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

	// 给全局设置user变量
	app.get('*', function(req, res, next){
		if(req.user || !app.locals.user){
			app.locals.user = req.user;
		}
		next();
	});
	
	//首页
	app.get('/', index.index);

	//用户操作
	app.get('/user/list', user.list);
	app.get('/user/new', user.new);
	app.get('/user/login', user.login);
	app.post('/user/login', user.doLogin)
	app.get('/user/logout', user.logout);
	//后台管理
	
};