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

var Login = mongoose.model('Login',LoginSchema);
module.exports = Login;