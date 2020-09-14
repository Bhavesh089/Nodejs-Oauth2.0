const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var secret = require('../config/keys');
/* User schema */
// const userSchema = new Schema(
// 	{
// 		username: String,
// 		googleId: String,
// 		facebookId: String,
// 		userEmail: String,
// 		accessToken: String,
// 		salt: String,
// 		active: Boolean
// 	},
// 	{ timestamps: true }
// );
const userSchema = new Schema(
	{
		method: {
			type: String,
			enum: [ 'local', 'google', 'facebook' ]
		},
		local: {
			username: String,
			userEmail: String,
			accessToken: String,
			secretToken: String,
			salt: String,
			active: Boolean
		},
		google: {
			googleId: String,
			userEmail: String,
			username: String,
			accessToken: String
		},
		facebook: {
			facebookId: String,
			username: String,
			userEmail: String,
			accessToken: String
		}
	},
	{ timestamps: true }
);
/*
JSON representation of the user including a token
*/
userSchema.methods.toAuthJSON = function() {
	return {
		username: this.local.username,
		email: this.local.email,
		token: this.generateJWT()
	};
};

/*
Method to hash passwords. 
A random salt is generated for each user and the salt is being used to generate a hash for the password.
pbkdf2Sync() takes five parameters: 
  (password to hash, 
    salt, 
    iteration: number of times to hash the password,
    length: how long the hash should be,
    algorithm
    )
*/
userSchema.methods.setPassword = function(password) {
	this.local.salt = crypto.randomBytes(16).toString('hex');
	this.local.accessToken = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
};

/*
  JWT: Json Web Token
  the token payload has the following fields:
  - id: which is the database id of the user
  - username: which is the username of the user
  - exp: which is a UNIX timestamp in seconds that determines when the token will expire. 
  */
userSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	return jwt.sign(
		{
			id: this._id,
			username: this.local.username,
			exp: parseInt(exp.getTime() / 1000)
		},
		secret.Jwt.secret
	);
};

/*
  Check if password is valid
  */
userSchema.methods.validPassword = function(password) {
	var passwordHash = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
	return this.local.accessToken === passwordHash;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
