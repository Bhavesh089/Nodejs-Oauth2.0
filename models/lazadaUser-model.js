const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const LazadaSchema = new Schema({
// 	access_token: { type: String, required: true },
// 	refresh_token: { type: String, required: true },
// 	refresh_expires_in: { type: String, required: true },
// 	expires_in: { type: String, required: true },
// 	seller_id: { type: String, required: true },
// 	account: { type: String, required: true },
// 	userId: { type: String, required: true }
// });

// const LazadaUser = mongoose.model('Lazadauser', LazadaSchema);

// module.exports = LazadaUser;

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
		created_datetime: Date,
		userId: String,
		expire_accesstoken: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
