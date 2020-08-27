const express = require('express');
const passport = require('passport');
const router = express.Router();
const lazadaUser = require('../models/lazadaUser-model');
const authController = require('../Controllers/auth-controller');
//Login page route
router.get('/login', (req, res) => {
	res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
	// handle with passport
	req.logout();
	res.redirect('/');
});

// auth with googleSignup
router.get(
	'/signup/google',
	passport.authenticate('googleSignup', {
		scope: [ 'profile', 'email' ]
	})
);

// callback route for googleaSignup to redirect to
router.get('/signup/google/redirect', passport.authenticate('googleSignup'), (req, res) => {
	//res.send(req.user);
	res.redirect('/signup/');
});

// auth with googlelogin
router.get(
	'/login/google',
	passport.authenticate('googleLogin', {
		scope: [ 'profile', 'email' ]
	})
);

// callback route for googlelogin to redirect to
router.get('/login/google/redirect', passport.authenticate('googleLogin'), (req, res) => {
	//res.send(req.user);
	res.redirect('/profile/');
});

// auth with facebook signup
router.get(
	'/signup/facebook',
	passport.authenticate('facebookSignup', {
		scope: [ 'public_profile', 'email' ]
	})
);

// callback route for facebooksignup to redirect to
router.get('/signup/facebook/redirect', passport.authenticate('facebookSignup'), (req, res) => {
	//res.send(req.user);
	// console.log(res.json() + '---------->');
	res.redirect('/signup/');
});

//auth with facebooklogin
router.get(
	'/login/facebook',
	passport.authenticate('facebookLogin', {
		scope: [ 'public_profile', 'email' ]
	})
);

// callback route for facebooklogin to redirect to
router.get('/login/facebook/redirect', passport.authenticate('facebookLogin'), (req, res) => {
	//res.send(req.user);
	console.log(res);
	res.redirect('/profile/');
});

// auth with lazada
router.get('/lazada', passport.authenticate('oauth2'));

//Lazada callback route
router.get('/lazada/redirect', authController.authCheck, authController.lazadaGet_token);

// router.get(
// 	'/lazada/renewToken',
// 	(req, res) => {
// 		console.log(req.query.refreshtoken);
// 		refreshToken = req.query.refreshtoken;

// 		// console.log(res.status(200).json({ code: code }));
// 		res.redirect('/profile/');
// 	}

// 	// passport.authenticate('oauth2'),
// 	// wrap passport.authenticate call in a middleware function
// );

module.exports = router;
