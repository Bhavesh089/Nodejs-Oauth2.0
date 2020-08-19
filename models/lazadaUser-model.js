const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LazadaSchema = new Schema({
	access_token: { type: String, required: true },
	refresh_token: { type: String, required: true },
	refresh_expires_in: { type: String, required: true },
	expires_in: { type: String, required: true },
	seller_id: { type: String, required: true },
	account: { type: String, required: true },
	userId: { type: String, required: true }
});

const LazadaUser = mongoose.model('Lazadauser', LazadaSchema);

module.exports = LazadaUser;
