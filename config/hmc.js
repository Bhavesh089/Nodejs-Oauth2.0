const crypto = require('crypto');
const keys = require('./keys.js');

const secret = keys.lazada.clientSecret;
const appkey = keys.lazada.clientID;

var message = (appkey, sign_method) => {
	const msg = [ appkey, sign_method ];
	sorting = sort(msg);
};

var hash = crypto.createHmac('sha256', secret).update(message);

// to lowercase hexits
hash.digest('hex');

// to base64
hash.digest('base64');
