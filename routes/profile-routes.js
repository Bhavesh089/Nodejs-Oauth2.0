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

const lazadaUsercheck = (req, res, next) => {
	if (req.session.result) {
		res.locals.lazadauser = req.session.result;
		console(res.locals.lazadauser + '------------------->');
		req.session.result = null;
		next();
	} else {
		next();
	}
};

router.get('/', authCheck, lazadaUsercheck, (req, res, next) => {
	//res.send("Greetings, " + req.user.username + "! you are logged in. ");
	// let lazadaUser = req.session.result;

	const lazada = res.locals.lazadauser;
	console.log(lazada);
	res.render('profile', { user: req.user, lazadauser: lazada });
});

module.exports = router;
