const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('login');
});

/* User login route */
router.post('/', function(req, res, next) {
	const { email, password } = req.body;
	console.log(req.body);
	if (!email) {
		return res.render('login', { error_msg: "Email can't be blank" });
	}
	if (!password) {
		return res.render('login', { error_msg: "Password can't be blank" });
	}
	passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/connect',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;
