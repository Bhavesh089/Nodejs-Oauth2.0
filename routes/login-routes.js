const passport = require('passport');
const express = require('express');
const router = express.Router();
const captchaSecret = require('../config/keys');
const request = require('request');

router.get('/', (req, res, next) => {
	res.render('login');
});

/* User login route */
router.post('/', function(req, res, next) {
	const { email, password } = req.body;
	const CaptchaResponse = req.body['g-recaptcha-response'];
	let recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify?';
	recaptcha_url += 'secret=' + captchaSecret.googleCaptcha.secret + '&';
	recaptcha_url += 'response=' + req.body['g-recaptcha-response'] + '&';
	recaptcha_url += 'remoteip=' + req.connection.remoteAddress;
	console.log(req.body);
	if (!email) {
		return res.render('login', { error_msg: "Email can't be blank" });
	}
	if (!password) {
		return res.render('login', { error_msg: "Password can't be blank" });
	}
	if (!CaptchaResponse) {
		return res.render('login', { error_msg: 'Please validate captcha' });
	}

	request(recaptcha_url, function(error, response, body) {
		body = JSON.parse(body);
		if (body.success !== undefined && !body.success) {
			// req.flash({ error_msg: 'Something went wrong or try signup again' });
			return res.render('login', { error_msg: 'Captcha validation failed' });
		}
	});

	passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/connect',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;
