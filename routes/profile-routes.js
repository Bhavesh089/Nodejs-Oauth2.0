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
// 	if (req.session.result) {
// 		res.locals.lazadauser = req.session.lazadaUsers;
// 		next();
// 	} else {
// 		next();
// 	}
// };

router.get('/', authCheck, (req, res, next) => {
	//res.send("Greetings, " + req.user.username + "! you are logged in. ");
	// let lazadaUser = req.session.result;
	console.log(res.locals.lazadauser);
	res.render('profile', { user: req.user, lazadauser: req.session.lazadaUsers });
});

module.exports = router;
