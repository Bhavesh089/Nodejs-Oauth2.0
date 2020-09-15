const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const OAuth2Strategy = require('passport-oauth2');
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys.js');
const User = require('../models/user-model');
// const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

// passport.use(
// 	new LocalStrategy(
// 		{
// 			usernameField: 'email'
// 		},
// 		function(email, password, done) {
// 			User.findOne({ 'local.userEmail': email }).then(function(user) {
// 				//Match User
// 				if (user) {
// 					return done(null, user);
// 				}
// 				if (!user) {
// 					return done(null, false, {
// 						message: 'Email is not registered'
// 					});
// 				}
// 				if (!user.validPassword(password)) {
// 					return done(null, false, {
// 						message: 'password is invalid'
// 					});
// 				}
// 				if (user.local.active === false) {
// 					return done(null, false, {
// 						message: 'You need to verify email first'
// 					});
// 				}
// 				// //Match password
// 				// bcrypt.compare(password, user.password, (err, isMatch) => {
// 				// 	if(err) throw err;

// 				// 	if (isMatch) {
// 				// 		return done(null, user);
// 				// 	} else {
// 				// 		return done(null, false, { message: 'password is incorrect' });
// 				// 	}

// 				// });
// 			});
// 		}
// 	)
// );
// passport.use(
// 	new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
// 		// Match user
// 		User.findOne({
// 			'local.userEmail': email
// 		}).then((user) => {
// 			if (!user) {
// 				return done(null, false, { message: 'That email is not registered' });
// 			}

// 			// Match password
// 			if (!user.validPassword(password)) {
// 				return done(null, false, {
// 					message: 'password is invalid'
// 				});
// 			}
// 			if (user) {
// 				return done(null, user);
// 			}
// 		});
// 	})
// );

passport.use(
	'facebookSignup',
	new FacebookStrategy(
		{
			clientID: keys.facebook.clientID,
			clientSecret: keys.facebook.clientSecret,
			// callbackURL: 'http://localhost:3000/auth/facebook/redirect'
			callbackURL: 'https://lazadaserver-fback.herokuapp.com/auth/signup/facebook/redirect'
		},
		function(accessToken, refreshToken, profile, done) {
			// check if user already exists in our db
			console.log(profile);
			User.findOne({ facebookId: profile.id }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					done(null, currentUser);
				} else {
					// if not, create user in our db
					new User({
						username: profile.displayName,
						facebookId: profile.id,
						userEmail: profile.emails[0].value
					})
						.save()
						.then((newUser) => {
							console.log('new user created: ' + newUser);
							done(null, newUser);
						});
				}
			});
		}
	)
);

passport.use(
	'facebookLogin',
	new FacebookStrategy(
		{
			clientID: keys.facebook.clientID,
			clientSecret: keys.facebook.clientSecret,
			// callbackURL: 'http://localhost:3000/auth/facebook/redirect'
			callbackURL: 'https://lazadaserver-fback.herokuapp.com/auth/login/facebook/redirect',
			profileFields: [ 'id', 'email', 'displayName', 'photos' ]
		},
		function(accessToken, refreshToken, profile, done) {
			// check if user already exists in our db
			console.log(profile);
			console.log(accessToken);
			console.log(refreshToken);
			User.findOne({ 'facebook.facebookId': profile.id }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					done(null, currentUser);
				} else {
					// if not, create user in our db
					new User({
						method: 'facebook',
						facebook: {
							username: profile.displayName,
							facebookId: profile.id,
							userEmail: profile.emails[0].value,
							accessToken: accessToken
						}
					})
						.save()
						.then((newUser) => {
							console.log('new user created: ' + newUser);
							done(null, newUser);
						});
				}
			});
		}
	)
);

passport.use(
	'googleSignup',
	new GoogleStrategy(
		{
			// options for the google strategy
			callbackURL: 'https://lazadaserver-fback.herokuapp.com/auth/signup/google/redirect',
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret
		},
		(accessToken, refreshToken, profile, done) => {
			// check if user already exists in our db
			User.findOne({ googleId: profile.id }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					done(null, currentUser);
				} else {
					// if not, create user in our db
					new User({
						username: profile.displayName,
						googleId: profile.id,
						userEmail: profile.emails[0].value
					})
						.save()
						.then((newUser) => {
							console.log('new user created: ' + newUser);
							done(null, newUser);
						});
				}
			});
		}
	)
);

passport.use(
	'googleLogin',
	new GoogleStrategy(
		{
			// options for the google strategy
			callbackURL: 'https://lazadaserver-fback.herokuapp.com/auth/login/google/redirect',
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret
		},
		(accessToken, refreshToken, profile, done) => {
			console.log(profile);
			console.log(accessToken);
			console.log(refreshToken);
			// check if user already exists in our db
			User.findOne({ 'google.googleId': profile.id }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					done(null, currentUser);
				} else {
					// if not, create user in our db
					new User({
						method: 'google',
						google: {
							username: profile.displayName,
							googleId: profile.id,
							userEmail: profile.emails[0].value,
							accessToken: accessToken
						}
					})
						.save()
						.then((newUser) => {
							console.log('new user created: ' + newUser);
							done(null, newUser);
						});
				}
			});
		}
	)
);

passport.use(
	new OAuth2Strategy(
		{
			authorizationURL: 'https://auth.lazada.com/oauth/authorize',
			//tokenURL: "https://lazada-server.herokuapp.com/CreateToken",
			tokenURL: 'https://auth.lazada.com/rest/auth/token/create',
			clientID: keys.lazada.clientID,
			clientSecret: keys.lazada.clientSecret,
			callbackURL: '/auth/lazada/redirect',
			passReqToCallback: true
		},
		// passport callback function
		(req, accessToken, refreshToken, profile, done) => {
			console.log(req.query);
			console.log(accessToken);
			console.log(refreshToken);
			console.log(profile);

			new User({
				username: 'lazop.sg@gmail.com',
				googleId: profile.account
			})
				.save()
				.then((newUser) => {
					console.log('new user created: ' + newUser);
					done(null, newUser);
				});
		}
		// function (accessToken, refreshToken, profile, cb) {
		//   User.findOrCreate({ exampleId: profile.id }, function (err, user) {
		//     return cb(err, user);
		//   });
		// }
	)
);

//"https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true"
