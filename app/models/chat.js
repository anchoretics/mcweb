var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
	user: ObjectId
});
var a = 123;
var Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;