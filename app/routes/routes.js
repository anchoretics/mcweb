var express = require('express');
var index = require('../controllers/index');
var user = require('../controllers/user');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

	app.get('/', index);
	app.get('/user/list', user.list);
	app.get('/user/new', user.new);
	app.get('/user/login', user.login);
	app.get('/user/logout', user.logout);
};