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
		const result = req.session.result;
		req.session.result = null;
		next(result);
	} else {
		next();
	}
};

router.get('/', authCheck, lazadaUsercheck, (req, res, next, result) => {
	//res.send("Greetings, " + req.user.username + "! you are logged in. ");
	// let lazadaUser = req.session.result;
	console.log(result);
	res.render('profile', { user: req.user, lazadauser: result });
});

module.exports = router;
