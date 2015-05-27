;'use strict';
(function(){
  var socket = io();
  socket.on('webMessage', function(data){
      console.dir(data);
      var type = data.type || '';
      switch(type){
        case 'chat':
          appendChat(data);
          break;
        case 'login':
          appendLogin(data);
          break;
        case 'logout':
          appendLogout(data);
          break;
        case 'onlineUsers':
          appendOnlineUsers(data);
          break;
        default: break;
      }
    });
  function appendChat(data){

  }
  function appendLogin(data){

  }
  function appendLogout(data){

  }
  function appendOnlineUsers(data){

  }
	function getMsg(data){
      addMsg(data);
  }
  function sendMsg(){
    if($('#inputMessage').val()){
      socket.emit('webMessage', { type: 'chat', msg: $('#inputMessage').val(), username: username });
      $('#inputMessage').val('');
      $('#inputMessage').focus();
    }
  }
  function addMsg(data){
    var _date = new Date(data.time||Number(data.meta.createAt)||new Date().getTime());
    var time_str = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
    if(data.username == "#{user.username}"){
      $('#chatPanel').append("<li class='list-group-item' style='text-align:right;'>"+ data.username + " : " + data.msg + "<span style='margin-left:10px;color:gray;'>"+time_str+"</span>" + "</li>");
    }else{
      $('#chatPanel').append("<li class='list-group-item'>" + "<span style='margin-right:10px;color:gray;'>"+time_str+"</span>" + data.username + " : " + data.msg +"</li>");
    }
    $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
  }
  //回车事件
  $(window).keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $('#inputMessage').focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      sendMsg();
    }
  });
  //发送按钮事件
  $('#btnSend').on('click', sendMsg);
  //定时任务，请求在线用户
  window.setInterval(function(){
    socket.emit('webMessage', {type: 'onlineUsers'});
  }, 30000);

  socket.on('posted message', function(data){
      data.msg = data.message;
      addMsg(data);
    });
  socket.on('user join', function(data){
      $('#chatPanel').append("<li class='list-group-item' style='text-align:center;'>"+ data.username + " : " + data.msg +"</li>");
      $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
    });
  socket.on('user left', function(data){
      $('#chatPanel').append("<li class='list-group-item' style='text-align:center;'>"+ data.username + " : " + data.msg +"</li>");
      $('#chatPanel')[0].scrollTop = $('#chatPanel')[0].scrollHeight;
    });
  socket.emit('login', { username: '#{user.username}', userID: '#{user._id}' });
  // 如果未登录，就先登录再发送，其中data是未登录前发送到服务器，并由服务器又原样返回的
  socket.on('nologin', function(data){
      socket.emit('login', { username: '#{user.username}', userID: '#{user._id}' });
      socket.emit('new web message', data);
    });
})();