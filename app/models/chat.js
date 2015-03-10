var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
	user: ObjectId
});

var Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;