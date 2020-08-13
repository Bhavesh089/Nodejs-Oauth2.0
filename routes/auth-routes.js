const express = require('express');
const passport = require('passport');
const router = express.Router();
const keys = require('../config/keys');

// auth login
router.get('/login', (req, res) => {
	res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
	// handle with passport
	req.logout();
	res.redirect('/');
});

// auth with google
router.get(
	'/google',
	passport.authenticate('google', {
		scope: [ 'profile' ]
	})
);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	//res.send(req.user);
	res.redirect('/profile/');
});

router.get(
	'/facebook',
	passport.authenticate('facebook', {
		scope: [ 'public_profile' ]
	})
);

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
	//res.send(req.user);
	console.log(res);
	res.redirect('/profile/');
});

router.post('/profile', passport.authenticate('oauth2'), passport.authenticate('hmac'), (req, res) => {
	res.json(req.user);
});
// auth with lazada
router.get('/lazada', passport.authenticate('oauth2'));

// callback route for google to redirect to
router.get(
	'/lazada/redirect',
	// passport.authenticate('oauth2'),
	// wrap passport.authenticate call in a middleware function
	function(req, res, next) {
		const api = '/auth/token/create';
		const code = req.params.code;
		console.log(code);
		const time = new Date();
		const parameters = {
			app_key: keys.lazada.clientID,
			sign_method: 'sha256',
			timestamp: time.getTime(),
			code: code
		};
		const sorted_parameters = [];
		Object.keys(parameters).sort().forEach(function(v, i) {
			console.log(sorted_parameters.push(v, parameters[v]));
		});
		console.log(sorted_parameters.join(''));
		parameters_str = api + sorted_parameters.join('');
		let hash = crypto
			.createHmac('sha256', encode_utf8(keys.lazada.clientSecret))
			.update(encode_utf8(parameters_str).digest('hex').toUpperCase());
		console.log(hash);
		// call passport authentication passing the "local" strategy name and a callback function
		passport.authenticate('oauth2', function(error, user, info) {
			// this will execute in any case, even if a passport strategy will find an error
			// log everything to console
			console.log(error);
			console.log(user);
			console.log(info);

			if (error) {
				res.status(401).send(error);
			} else if (!user) {
				res.status(401).send(info);
			} else {
				next();
			}

			res.status(401).send(info);
		})(req, res);
	},
	(req, res) => {
		console.log(res);
		res.redirect('/profile/');
	}
);

module.exports = router;
