// const jwt = require('jsonwebtoken');
// var secret = require('../config/keys');
const User = require('../models/user-model');

module.exports = {
	ensureAuthenticated: async function(req, res, next) {
		if (req.isAuthenticated()) {
			const curruser = await User.findById(req.user.id);
			if (curruser) {
				token = curruser.generateJWT();
				res.setHeader('Authorization', 'Bearer ' + token);
				return next();
			}
		}
		req.flash('error_msg', 'Please log in to view that resource');
		res.redirect('/register');
	},
	forwardAuthenticated: function(req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/connect');
	}
	// token: function(req, res, next) {
	// 	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	// 		const token = req.headers.authorization.split(' ')[1];
	// 		jwt.verify(token, secret.Jwt.secret, (err, user) => {
	// 			if (err) return res.sendStatus(403);
	// 			return next();
	// 		});
	// 	}
	// }
};

// exports.authtokenCheck = (req, res, next) => {
// 	if (req.user) {
// 		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
// 			const token = req.headers.authorization.split(' ')[1];
// 			jwt.verify(token, secret.Jwt.secret, (err, user) => {
// 				if (err) return res.sendStatus(403);
// 				req.user = user;
// 				next();
// 			});
// 		} else if (req.user.facebook.accessToken || req.user.google.accessToken) {
// 			next();
// 		} else {
// 			return res.sendStatus(401);
// 		}
// 	} else {
// 		return res.sendStatus(401);
// 	}
// };
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
