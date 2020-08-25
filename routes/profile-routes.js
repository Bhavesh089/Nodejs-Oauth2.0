const express = require('express');
const router = express.Router();
const lazadaUser = require('../models/lazadaUser-model');

const authCheck = (req, res, next) => {
	if (!req.user) {
		// if user not logged in
		res.redirect('/');
	} else {
		// if logged in
		next();
	}
};

// const lazadaUsercheck = (req, res, next) => {
// 	if (req.session.lazadaUsers) {
// 		const lazUser = req.session.lazadaUsers;
// 		console.log(lazUser + 'laz_user');
// 		res.locals.lazadauser = lazUser;
// 		console.log(res.locals.lazadauser + '------------------->');
// 		req.session.lazadaUsers = null;
// 		next();
// 	} else {
// 		next();
// 	}
// };
const lazadaUsercheck = (req, res, next) => {
	lazadaUser.findOne({ userId: req.user.id }).exec().then((result) => {
		if (result) {
			res.locals.lazadauser = result;
			console.log(res.locals.lazadauser);
			return next();
		} else {
			res.locals.lazadauser = null;
			console.log(res.locals.lazadauser);
			return next();
		}
	});
};

router.get('/', authCheck, lazadaUsercheck, (req, res, next) => {
	console.log(res.locals.lazadauser);
	res.render('profile', { user: req.user, lazadauser: res.locals.lazadauser });
});

module.exports = router;
