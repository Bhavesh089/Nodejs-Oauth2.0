const mongoose = require('mongoose');
/* UserInfoSchema schema */
var UserInfoSchema = new mongoose.Schema({
	country: String,
	user_id: String,
	seller_id: String,
	short_code: String
});

/* Token schema */
var TokenSchema = new mongoose.Schema(
	{
		access_token: String,
		country: String,
		refresh_token: String,
		account_platform: String,
		refresh_expires_in: Number,
		country_user_info: [ UserInfoSchema ],
		expires_in: Number,
		account: String,
		code: String,
		request_id: String,
		userId: String,
		expire_accesstoken: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
