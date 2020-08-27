const express = require('express');
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || 3000;
const Token = require('./models/lazadaUser-model');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const signupRoutes = require('./routes/signup-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const request = require('request');
// set up view engine
app.set('view engine', 'ejs');

// set cookie session
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: [ keys.session.cookieKey ]
	})
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(
	keys.mongodb.dbURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	() => {
		console.log('connected to mongodb');
	}
);

//Inprogress

// cron.schedule('* * * * *', async function() {
// 	console.log('Running cron job 1 at ' + new Date(Date.now()).toString());
// 	console.log('Fetching expired tokens...');
// 	// call your function here

// 	var curDateTime = new Date().toISOString();
// 	console.log(curDateTime);
// 	tokens = await Token.find({
// 		expire_accesstoken: {
// 			$gte: curDateTime
// 		}
// 	});
// 	console.log('tokens');
// 	if (tokens) {
// 		propertiesObject = { refreshtoken: tokens.refresh_token };

// 		request(
// 			{ url: 'https://lazada-server.herokuapp.com/RenewToken', qs: propertiesObject },
// 			(err, response, body) => {
// 				if (err) {
// 					console.log(err);
// 					return;
// 				}

// 				console.log(response.statusCode);
// 				if (response.statusCode === 200) {
// 					let profile = JSON.parse(body);
// 					console.log(profile);
// 					console.log(profile.country_user_info_list[0]['seller_id']);
// 					Token.findOne({ account: profile.account }).then((currentUser) => {
// 						if (currentUser) {
// 							// already have the user
// 							console.log('user is: ' + currentUser);
// 							Token.update(
// 								{ account: profile.account },
// 								{
// 									$set: {
// 										access_token: profile.access_token,
// 										refresh_token: profile.refresh_token,
// 										refresh_expires_in: profile.refresh_expires_in,
// 										expires_in: profile.expires_in
// 									}
// 								}
// 							)
// 								.exec()
// 								.then((result) => console.log(result))
// 								.catch((err) => {
// 									res.status(400).json({ err: err });
// 								});
// 							// done(null, currentUser);
// 							// } else {
// 							// 	// if not, create user in our db
// 							// 	new Lazada({
// 							// 		access_token: profile.access_token,
// 							// 		refresh_token: profile.refresh_token,
// 							// 		refresh_expires_in: profile.refresh_expires_in,
// 							// 		expires_in: profile.expires_in,
// 							// 		seller_id: profile.country_user_info[0]['seller_id'],
// 							// 		account: profile.account
// 							// 	})
// 							// 		.save()
// 							// 		.then((newUser) => {
// 							// 			console.log('new user created: ' + newUser);
// 							// 			// done(null, newUser);
// 							// 		})
// 							// 		.catch((err) =>
// 							// 			response.status(404).json({
// 							// 				err: err
// 							// 			})
// 							// 		);
// 							//
// 						}
// 					});
// 					return console.log(profile.access_token);
// 				} else {
// 					return console.log(response.body);
// 				}
// 				//
// 			}
// 		);
// 	}
// 	console.log(tokens);
// 	console.log('Cron job 1 finished at ' + new Date(Date.now()).toString());
// });

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/signup', signupRoutes);

// create home route
app.get('/', (req, res) => {
	res.render('home', { user: req.user });
});

//Port listening
app.listen(port, () => {
	console.log('app now listening for requests on port ' + port);
});
