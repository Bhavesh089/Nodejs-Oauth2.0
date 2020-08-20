const express = require('express');
const router = express.Router();
const authCheck = (req, res, next) => {
	if (!req.user) {
		// if user not logged in
		res.redirect('/auth/login');
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

router.get('/', authCheck, (req, res, next) => {
	//res.send("Greetings, " + req.user.username + "! you are logged in. ");
	// let lazadaUser = req.session.result;
	// console.log(res.locals.lazadauser);
	// const lazada = res.locals.lazadauser;
	// console.log(JSON.parse(lazada));

	console.log(req.session.lazadUser);
	res.render('profile', { user: req.user, lazadauser: req.session.lazadaUsers });
});

module.exports = router;
