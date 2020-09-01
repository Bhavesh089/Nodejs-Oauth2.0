const request = require('request');
const Token = require('../models/lazadaUser-model');

exports.refreshToken = (tokens) => {
	propertiesObject = { refreshtoken: tokens[0]['refresh_token'] };

	request({ url: 'https://lazada-server.herokuapp.com/RenewToken', qs: propertiesObject }, (err, response, body) => {
		if (err) {
			console.log(err);
			return;
		}

		console.log(response.statusCode);
		if (response.statusCode === 200) {
			let profile = JSON.parse(body);
			console.log(profile);
			console.log(profile.country_user_info_list[0]['seller_id']);
			Token.findOne({ account: profile.account }).then((currentUser) => {
				if (currentUser) {
					// already have the user
					console.log('user is: ' + currentUser);
					Token.update(
						{ account: profile.account },
						{
							$set: {
								access_token: profile.access_token,
								refresh_token: profile.refresh_token,
								refresh_expires_in: profile.refresh_expires_in,
								expires_in: profile.expires_in,
								expire_accesstoken: new Date(+new Date() + profile.expires_in * 1000)
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
};
