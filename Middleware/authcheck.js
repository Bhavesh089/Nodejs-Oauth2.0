const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys');

module.exports = {
	ensureAuthenticated: async function(req, res, next) {
		if (req.isAuthenticated()) {
			const curruser = await User.findById(req.user.id);
			if (curruser) {
				token = curruser.generateJWT();
				// res.setHeader('Content-Type', 'application/json; charset=utf-8');
				res.header('Authorization', 'Bearer ' + token);

				return next();
			}
		}
		req.flash('error_msg', 'Please log in to view that resource');
		res.redirect('/login');
	},
	forwardAuthenticated: function(req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/connect');
	},
	checktoken: function(req, res, next) {
		var tokens = res.getHeaders();

		// if (req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {

		console.log(tokens.authorization);
		if (tokens.authorization.split(' ')[0] === 'Bearer') {
			accessToken = tokens.authorization.split(' ')[1];
			jwt.verify(accessToken, secret.Jwt.secret, (err, user) => {
				if (err) return res.sendStatus(403);
				return next();
			});
		} else {
			console.log('failure');
		}
	}
};
