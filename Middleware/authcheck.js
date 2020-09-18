const User = require('../models/user-model');

module.exports = {
	ensureAuthenticated: async function(req, res, next) {
		if (req.isAuthenticated()) {
			const curruser = await User.findById(req.user.id);
			if (curruser) {
				token = curruser.generateJWT();
				res.set('Authorization', 'Bearer ' + token);
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
	},
	token: function(req, res, next) {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, secret.Jwt.secret, (err, user) => {
				if (err) return res.sendStatus(403);
				return next();
			});
		} else {
			console.log('unsucceed');
		}
	}
};
