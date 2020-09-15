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
			console.log(req.user);
			res.header('Authorization', 'Bearer ' + user.generateJWT());
			return res.redirect('/connect');
		} else {
			console.log(info.message);
			return res.render('Register', { error_msg: info.message });
		}
	})(req, res, next);
});
// router.post('/', (req, res, next) => {
// 	passport.authenticate('local', {
// 		successRedirect: '/connect',
// 		failureRedirect: '/',
// 		failureFlash: true
// 	})(req, res, next);
// });

module.exports = router;
