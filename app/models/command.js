var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommandSchema = new mongoose.Schema({
	message: String,
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

var Command = mongoose.model('Command',CommandSchema);
module.exports = Command;