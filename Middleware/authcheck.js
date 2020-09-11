const jwt = require('jsonwebtoken');
var secret = require('../config/keys');

exports.authtokenCheck = (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, secret.Jwt.secret, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	} else {
		return res.sendStatus(401);
	}
};

// var auth = {
//   required: jwt({
//     secret: secret,
//     userProperty: "payload",
//     getToken: getTokenFromHeader,
//   }),
//   optional: jwt({
//     secret: secret,
//     userProperty: "payload",
//     credentialsRequired: false,
//     getToken: getTokenFromHeader,
//   }),
// };
