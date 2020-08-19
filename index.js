const express = require('express');
//var fs = require("fs");
//var https = require("https");
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
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

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

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

app.listen(port, () => {
	console.log('app now listening for requests on port ' + port);
});
