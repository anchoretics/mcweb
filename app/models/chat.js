var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
	user: ObjectId
});
<<<<<<< HEAD

=======
var a = 123;
>>>>>>> f0661c48b56996f572e5e281dea396328e9f83e5
var Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;