const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const OAuth2Strategy = require('passport-oauth2');
const keys = require('./keys.js');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

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
// passport.use(
// 	new HmacStrategy(function(publicKey, done) {
// 		User.findOne({ publicKey: publicKey }, function(err, user) {
// 			if (err) {
// 				return done(err);
// 			}
// 			if (!user) {
// 				return done(null, false);
// 			}
// 			return done(null, user, privateKey);
// 		});
// 	})
// );

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
