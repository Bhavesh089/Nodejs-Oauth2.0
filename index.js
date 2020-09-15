const express = require('express');
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || 3000;
const Token = require('./models/lazadaUser-model');
const authRoutes = require('./routes/auth-routes');
const connectRoutes = require('./routes/connect-routes');
const signupRoutes = require('./routes/signup-routes');
const profileRoutes = require('./routes/profile');
const loginRoutes = require('./routes/login-routes');
const verifytokenRoutes = require('./routes/verifytoken');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const cronjobController = require('./Controllers/cronjob-controller');
const registerRoutes = require('./routes/Register');
const analyticsRoutes = require('./routes/analytics-routes');
const forgotRoutes = require('./routes/forgotps');
const forgotsendmailRoutes = require('./routes/forgotsendemail');

// set up view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
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
require('./config/passport-setup');
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

cron.schedule('* * * * *', async function() {
	console.log('Running cron job 1 at ' + new Date(Date.now()).toString());
	console.log('Fetching expired tokens...');
	// call your function here
	var today = new Date();
	var yesterday = new Date(today);

	yesterday.setDate(today.getDate() - 1);
	console.log('yes Date : ', yesterday);
	console.log('today :', today);
	// var curDateTime = new Date().toISOString();
	tokens = await Token.find({
		expire_accesstoken: {
			$gte: yesterday,
			$lte: today
		}
	});
	console.log('tokens');
	if (tokens !== 'undefined' && tokens.length > 0) {
		console.log(tokens);
		return cronjobController.refreshToken(tokens);
	} else {
		console.log('No tokens are to be updated');
	}
	console.log(tokens);
	console.log('Cron job 1 finished at ' + new Date(Date.now()).toString());
});

// set up routes
app.use('/auth', authRoutes);
app.use('/connect', connectRoutes);
app.use('/profile', profileRoutes);
// app.use('/signup', signupRoutes);
app.use('/register', registerRoutes);
// app.use('/orangeimg', express.static('views'));
app.use('/assets', express.static('assets'));
app.use('/login', loginRoutes);
app.use('/verifytoken', verifytokenRoutes);
app.use('/loginassets', express.static('loginassets'));
app.use('/analytics', analyticsRoutes);
app.use('/forgotpassword', forgotRoutes);
app.use('/sendemail', forgotsendmailRoutes);

// create home route
app.get('/', (req, res) => {
	res.render('Register', { user: req.user });
});

//Port listening
app.listen(port, () => {
	console.log('app now listening for requests on port ' + port);
});
