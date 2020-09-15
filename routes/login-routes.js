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
	passport.authenticate('local', {
		failureRedirect: '/Register',
		successRedirect: '/connect',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;
