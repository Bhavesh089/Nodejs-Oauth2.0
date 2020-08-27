const express = require('express');
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const signupRoutes = require('./routes/signup-routes');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');

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

// cron.schedule('* * * * *', async function() {
// 	console.log('Running cron job 1 at ' + new Date(Date.now()).toString());
// 	console.log('Fetching expired tokens...');
// 	// call your function here

// 	var curDateTime = new Date().toISOString();
// 	console.log(curDateTime);
// 	tokens = await Token.find({ created_datetime: curDateTime });
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

// const httpsOptions = {
//   key: fs.readFileSync("./security/key.pem"),
//   cert: fs.readFileSync("./security/cert.pem"),
// };

// const server = https.createServer(httpsOptions, app).listen(port, () => {
//   console.log("server running at " + port);
//   console.log("Go to https://localhost:3000/");
// });

//Port listening
app.listen(port, () => {
	console.log('app now listening for requests on port ' + port);
});
