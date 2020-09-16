const express = require('express');
const router = express.Router();
const lazadaUser = require('../models/lazadaUser-model');
const { ensureAuthenticated, token } = require('../Middleware/authcheck');
// const authchecks = require('../Middleware/authcheck');
// const authCheck = (req, res, next) => {
// 	if (!req.user) {
// 		// if user not logged in
// 		res.redirect('/');
// 	} else {
// 		// if logged in
// 		next();
// 	}
// };

const lazadaUsercheck = (req, res, next) => {
	//checking logged user in lazadaUser model
	lazadaUser.findOne({ userId: req.user.id }).exec().then((result) => {
		if (result) {
			//if user present store it in local and pass next.
			res.locals.lazadauser = result;
			console.log(res.locals.lazadauser);
			return next();
		} else {
			//if not null
			res.locals.lazadauser = null;
			console.log(res.locals.lazadauser);
			return next();
		}
	});
};

router.get('/', ensureAuthenticated, (req, res, next) => {
	//Rendering profile page and passing required arguments.
	console.log(res.locals.lazadauser);
	res.render('profile', { user: req.user, lazadauser: res.locals.lazadauser });
});

module.exports = router;
