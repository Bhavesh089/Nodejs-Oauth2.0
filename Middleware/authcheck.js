const jwt = require('jsonwebtoken');
var secret = require('../config/keys');
let user = require('../models/user-model');

exports.authtokenCheck = (req, res, next) => {
	if (req.user) {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, secret.Jwt.secret, (err, user) => {
				if (err) return res.sendStatus(403);
				req.user = user;
				next();
			});
		} else if (req.user.facebook.accessToken || req.user.google.accessToken) {
			next();
		} else {
			return res.sendStatus(401);
		}
	} else {
		return res.sendStatus(401);
	}
};
// exports.authtokenCheck = (req, res, next) => {
// 	if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') || req.user) {
// 		const token = req.headers.authorization.split(' ')[1];
// 		jwt.verify(token, secret.Jwt.secret, (err, user) => {
// 			if (err) return res.sendStatus(403);
// 			req.user = user;
// 			next();
// 		});
// 	} else {
// 		return res.sendStatus(401);
// 	}
// };

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
