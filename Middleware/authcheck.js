var jwt = require('express-jwt');
var secret = require('../config/keys');

const authCheck = getTokenFromHeader((req, res, next) => {
	if ((req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') || req.user.accessToken) {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, secret.Jwt.secret, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	} else {
		return res.sendStatus(401);
	}
});

// var auth = {
//   required: jwt({
//     secret: secret,
//     userProperty: "payload",
//     getToken: getTokenFromHeader,
//   }),
//   optional: jwt({
//     secret: secret,
//     userProperty: "payload",
//     credentialsRequired: false,
//     getToken: getTokenFromHeader,
//   }),
// };
module.exports = authCheck;
