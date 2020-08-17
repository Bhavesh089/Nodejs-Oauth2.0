const express = require('express');
const passport = require('passport');
const router = express.Router();
// const lazadaRedirect_controller = require('../Controllers/Redirect');
const Lazada = require('../models/lazada-model');
var request = require('request');
// const keys = require('../config/keys');
// const crypto = require('crypto');
// const utf8 = require('utf8');
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

// router.post('/profile', passport.authenticate('oauth2'), passport.authenticate('hmac'), (req, res) => {
// 	res.json(req.user);
// });
// auth with lazada
// router.get('/lazada', passport.authenticate('oauth2'));

// callback route for google to redirect to
// router.get(
// 	'/lazada/redirect',
// 	lazadaRedirect_controller.lazadaRedirect,
// 	(req, res) => {
// 		console.log(res);
// 		res.redirect('/profile/');
// 	}

// 	// passport.authenticate('oauth2'),
// 	// wrap passport.authenticate call in a middleware function
// );

router.get(
	'/lazada/redirect',
	(req, res) => {
		console.log(req.query.code);
		code = req.query.code;

		propertiesObject = { code: code };

		// request({ url: 'http://localhost:8000/CreateToken', qs: propertiesObject }, (err, response, body) => {
		request(
			{ url: 'https://lazada-server.herokuapp.com/CreateToken', qs: propertiesObject },
			(err, response, body) => {
				if (err) {
					console.log(err);
					return;
				}

				console.log(response.statusCode);
				if (response.statusCode === 200) {
					let profile = JSON.parse(body);
					console.log(profile.country_user_info[0]['seller_id']);
					Lazada.findOne({ seller_id: profile.country_user_info[0]['seller_id'] }).then((currentUser) => {
						if (currentUser) {
							// already have the user
							console.log('user is: ' + currentUser);
							// done(null, currentUser);
						} else {
							// if not, create user in our db
							new Lazada({
								access_token: profile.access_token,
								refresh_token: profile.refresh_token,
								refresh_expires_in: profile.refresh_expires_in,
								expires_in: profile.expires_in,
								seller_id: profile.country_user_info[0]['seller_id'],
								account: profile.account
							})
								.save()
								.then((newUser) => {
									console.log('new user created: ' + newUser);
									// done(null, newUser);
								})
								.catch((err) =>
									response.status(404).json({
										err: err
									})
								);
						}
					});
					return console.log(profile.access_token);
				} else {
					return console.log(response.body);
				}
				//
			}
		);
		// console.log(res.status(200).json({ code: code }));
		res.redirect('/profile/');
	}

	// passport.authenticate('oauth2'),
	// wrap passport.authenticate call in a middleware function
);

router.get(
	'/lazada/renewToken',
	(req, res) => {
		console.log(req.query.refreshtoken);
		refreshToken = req.query.refreshtoken;

		propertiesObject = { refreshtoken: refreshToken };

		request({ url: 'http://localhost:8000/RenewToken', qs: propertiesObject }, (err, response, body) => {
			if (err) {
				console.log(err);
				return;
			}

			console.log(response.statusCode);
			if (response.statusCode === 200) {
				let profile = JSON.parse(body);
				console.log(profile);
				console.log(profile.country_user_info_list[0]['seller_id']);
				Lazada.findOne({ seller_id: profile.country_user_info_list[0]['seller_id'] }).then((currentUser) => {
					if (currentUser) {
						// already have the user
						console.log('user is: ' + currentUser);
						Lazada.update(
							{ seller_id: profile.country_user_info_list[0]['seller_id'] },
							{
								$set: {
									access_token: profile.access_token,
									refresh_token: profile.refresh_token,
									refresh_expires_in: profile.refresh_expires_in,
									expires_in: profile.expires_in
								}
							}
						)
							.exec()
							.then((result) => console.log(result))
							.catch((err) => {
								res.status(400).json({ err: err });
							});
						// done(null, currentUser);
						// } else {
						// 	// if not, create user in our db
						// 	new Lazada({
						// 		access_token: profile.access_token,
						// 		refresh_token: profile.refresh_token,
						// 		refresh_expires_in: profile.refresh_expires_in,
						// 		expires_in: profile.expires_in,
						// 		seller_id: profile.country_user_info[0]['seller_id'],
						// 		account: profile.account
						// 	})
						// 		.save()
						// 		.then((newUser) => {
						// 			console.log('new user created: ' + newUser);
						// 			// done(null, newUser);
						// 		})
						// 		.catch((err) =>
						// 			response.status(404).json({
						// 				err: err
						// 			})
						// 		);
						//
					}
				});
				return console.log(profile.access_token);
			} else {
				return console.log(response.body);
			}
			//
		});
		// console.log(res.status(200).json({ code: code }));
		res.redirect('/profile/');
	}

	// passport.authenticate('oauth2'),
	// wrap passport.authenticate call in a middleware function
);

module.exports = router;
