var mongoose = require('mongoose');


var CommandSchema = new mongoose.Schema({
	username: String,
	command: String,
	flags: String,
	time: {
		type: Date,
		default: Date.now()
	}
});