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
			type: Number, 
			max: 10,
			default: new Date().getTime()
		},
		updateAt: {
			type: Number, 
			max: 10,
			default: new Date().getTime()
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