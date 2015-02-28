var index = require('./index');
var user = require('./user');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
	//加载passport功能
	app.use(passport.initialize());
	//自定义认证策略
	passport.use(new LocalStrategy(
	  function(username, password, done) {
		var user = {
            id: '1',
            username: 'admin',
            password: '123456'
        }; // 可以配置通过数据库方式读取登陆账号

        if (username !== user.username) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (password !== user.password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
	  }
	));

	app.get('/', index);
	app.get('/user/list', user.list);
	app.get('/user/new', user.new);
	app.get('/user/login', user.login);
	app.post('/user/login',	passport.authenticate('local', 
		{
			successRedirect: '/',
			failureRedirect: '/user/login'
		}
	));
}