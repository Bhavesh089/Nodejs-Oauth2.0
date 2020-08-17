// const passport = require('passport');
// const keys = require('../config/keys');
// const crypto = require('crypto');
// const utf8 = require('utf8');

// (exports.lazadaRedirect = (req, res, next) => {
// 	const api = '/auth/token/create';
// 	const code = req.query.code;
// 	console.log(code);
// 	const time = new Date();
// 	const parameters = {
// 		app_key: keys.lazada.clientID,
// 		sign_method: 'sha256',
// 		timestamp: time.getTime(),
// 		code: code
// 	};
// 	const sorted_parameters = [];
// 	Object.keys(parameters).sort().forEach(function(v, i) {
// 		console.log(sorted_parameters.push(v, parameters[v]));
// 	});
// 	console.log(sorted_parameters.join(''));
// 	parameters_str = api + sorted_parameters.join('');
// 	let hash = crypto.createHmac('sha256', utf8.encode(keys.lazada.clientSecret)).update(utf8.encode(parameters_str));

// 	console.log(hash.digest('hex').toUpperCase());
// 	console.log(hash);
// 	// call passport authentication passing the "local" strategy name and a callback function
// 	passport.authenticate('oauth2', function(error, user, info) {
// 		// this will execute in any case, even if a passport strategy will find an error
// 		// log everything to console
// 		console.log(error);
// 		console.log(user);
// 		console.log(info);

// 		if (error) {
// 			res.status(401).send(error);
// 		} else if (!user) {
// 			res.status(401).send(info);
// 		} else {
// 			next();
// 		}

// 		res.status(401).send(info);
// 	})(req, res);
// })
