var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
	message: String,
	format: String,
	hostname: String,
	hostaddress: String,

	user: { 
		type: ObjectId,
		ref: 'User'
	},

	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
		  	type: Date,
		  	default: Date.now()
		},
		location: {
	 		x: String,
	 		y: String,
	 		z: String
		}
	}

});

var Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;