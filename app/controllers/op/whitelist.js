var Chat = require('../../models/chat');
var Login = require('../../models/login');
var Command = require('../../models/command');
var User = require('../../models/user');
var app = require('../../../app');

var whitelist = {};

whitelist.list = function(req, res){
    User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
        if (err) return next(err);
        res.render('op/whitelist', {
            users: users,
            currentPage: req.query.page || 1,
            pageCount: pageCount,
            itemCount: itemCount
        });
    },{ columns:null,populate:null,sortBy: 'username' });
};

whitelist.add = function(req, res){
    var _id = req.body.id;
    var _username = req.body.username;
    // 通过id增加的
    if(_id){
        User.findById(_id,function(err, u){
            if(u){
                u.whitelist = true;
                u.save(function(err){
                    if(err){
                        res.end(err);
                    }else{
                        var io = app.socketio;
                        io.emit(io.GAME_NAME, {type: io.MsgType.COMMAND, token: io.token, message: 'whitelist add ' + u.username});
                        res.end('success');
                    }
                });
            }else{
                res.end('无此用户：' + _id);
            }
        });
    }
    // 通过名字增加的
    if(_username){
        _username = _username.toLowerCase();
        User.findOne({username: _username}, function(err, u){
            if(u){
                res.end('已有此用户：' + _username);
            }else{
                var _user = new User({
                    username: _username,
                    allowfly: false,
                    world: 'world_home',
                    gamemode: 'SURVIVAL',
                    op: false,
                    online: false,
                    ban: false,
                    banip: false,
                    whitelist: true
                });
                _user.save(function(err){
                    if(err){
                        res.end(err);
                    }else{
                        var io = app.socketio;
                        io.emit(io.GAME_NAME, {type: io.MsgType.COMMAND, token: io.token, message: 'whitelist add ' + _user.username});
                        res.end('success');
                    }
                });
            }
        });
    }
};

whitelist.remove = function(req, res){
    var _id = req.body.id;
    User.findById(_id,function(err, u){
        u.whitelist = false;
        u.save(function(err){
            if(err){
                res.end(err);
            }else{
                var io = app.socketio;
                io.emit(io.GAME_NAME, {type: io.MsgType.COMMAND, token: io.token, message: 'whitelist remove ' + u.username});
                io.emit(io.GAME_NAME, {type: io.MsgType.COMMAND, token: io.token, message: 'minecraft:kick ' + u.username + ' 你已不在白名单里' });
                res.end('success');
            }
        });
    });
};

module.exports = whitelist;