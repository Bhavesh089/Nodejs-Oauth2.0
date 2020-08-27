const lazadaUser = require('../models/lazadaUser-model');
var request = require('request');

//Check user, its a Middleware for lazada callback route
exports.authCheck = (req, res, next) => {
	if (!req.user) {
		// if user not logged in
		res.redirect('/');
	} else {
		// if logged in
		res.locals.user = req.user.id;
		console.log(res.locals.user);
		next();
	}
};

exports.lazadaGet_token = (req, res) => {
	const userId = res.locals.user;
	console.log(userId);

	console.log(req.query.code);
	code = req.query.code;
	propertiesObject = { code: code };

	// request({ url: 'http://localhost:8000/CreateToken', qs: propertiesObject }, (err, response, body) => {
	//Sending recieved code to the CreateToken endpoint and get accesstoken.
	request({ url: 'https://lazada-server.herokuapp.com/CreateToken', qs: propertiesObject }, (err, response, body) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(response.statusCode);
		//If response status code is 200
		if (response.statusCode === 200) {
			let profile = JSON.parse(body);
			console.log(profile.country_user_info[0]['seller_id']);
			lazadaUser.findOne({ account: profile.account }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					res.redirect('/profile/');
					// done(null, currentUser);
				} else {
					let UserInfoSchema = {
						country: profile.country_user_info[0]['country'],
						user_id: profile.country_user_info[0]['country'],
						seller_id: profile.country_user_info[0]['seller_id'],
						short_code: profile.country_user_info[0]['short_code']
					};
					// if not, create user in our db
					new lazadaUser({
						access_token: profile.access_token,
						country: profile.country,
						refresh_token: profile.refresh_token,
						refresh_expires_in: profile.refresh_expires_in,
						expires_in: profile.expires_in,
						seller_id: profile.country_user_info[0]['seller_id'],
						account: profile.account,
						country_user_info: [ UserInfoSchema ],
						userId: userId
					})
						.save()
						.then((lazadaUser) => {
							console.log('new user created: ' + lazadaUser.account);
							res.redirect('/profile/');
						})
						.catch((err) =>
							res.status(500).json({
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
	});
};
