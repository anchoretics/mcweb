var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 13;

var UserSchema = new mongoose.Schema({

	username: {
		unique: true,
		type: String,
		index: true
 	},
 	nickname: String,
  	password: String,
 	name: {
 		first: String,
 		last: String
 	},
	  // 0: nomal user
	  // 1: verified user
	  // 2: professonal user
	  // >10: admin
	  // >50: super admin
	role: {
		type: Number,
		default: 0
	},
	online: {
		state: Boolean,
		time: Date,
		ip: String
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
		  	type: Date,
		  	default: Date.now()
		}
	}
});

UserSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
		var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
		user.password = bcrypt.hashSync(user.password, salt);
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else {
		this.meta.updateAt = Date.now()
	}
	next();
});

UserSchema.methods = {
	comparePwd: function(_password, cb) {
		return bcrypt.compareSync(_password, this.password);
	}
};

UserSchema.statics = {
	fetch: function(cb) {
		return this
		  	.find({})
		  	.sort('meta.updateAt')
		  	.exec(cb);
	},
	findById: function(id, cb) {
		return this
		  	.findOne({_id: id})
		  	.exec(cb);
	}
};
UserSchema.virtual('name.full').get(function () {
  	return this.name.first + ' ' + this.name.last;
});

var User = mongoose.model('User', UserSchema);

module.exports = User;