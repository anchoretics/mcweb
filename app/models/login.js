var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var LoginSchema = new mongoose.Schema({
	message: String,
	hostname: String,
	hostaddress: String,

	//type=login,logout
	type: String,
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

var Login = mongoose.model('Login',LoginSchema);
module.exports = Login;