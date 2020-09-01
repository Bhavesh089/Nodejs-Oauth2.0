const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* User schema */
const userSchema = new Schema(
	{
		username: String,
		googleId: String,
		facebookId: String,
		userEmail: String
	},
	{ timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
