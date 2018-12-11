const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordConf: {
		type: String,
	}
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);
module.exports = User;

