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
			default: new Date().getTime()
		},
		updateAt: {
			type: Number, 
			default: new Date().getTime()
		},
		location: {
	 		x: String,
	 		y: String,
	 		z: String
		}
	}

});

CommandSchema.plugin(require('mongoose-paginate'));
var Command = mongoose.model('Command',CommandSchema);
module.exports = Command;