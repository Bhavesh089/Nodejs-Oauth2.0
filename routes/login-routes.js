const passport = require('passport');
const express = require('express');
const router = express.Router();

/* User login route */
router.post('/', function(req, res, next) {
	const { email, password } = req.body;
	console.log(req.body);
	if (!email) {
		return res.render('Register', { error_msg: "Email can't be blank" });
	}
	if (!password) {
		return res.render('Register', { error_msg: "Password can't be blank" });
	}
	passport.authenticate('local', { failureRedirect: '/Register' }, function(err, user, info) {
		if (err) {
			console.log(err);
			// return next(err);
		}
		if (user) {
			// user.token = user.generateJWT();
			// res.json({ user: user.toAuthJSON() });
			console.log('hello');

			return res.header('Authorization', 'Bearer ' + user.generateJWT).redirect('/connect');
		} else {
			console.log(info.message);
			return res.render('Register', { error_msg: info.message });
		}
	})(req, res, next);
});

module.exports = router;
