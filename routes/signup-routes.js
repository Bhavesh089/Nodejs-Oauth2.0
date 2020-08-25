const express = require('express');
const router = express.Router();

const authCheck = (req, res, next) => {
	if (!req.user) {
		// if user not logged in
		res.redirect('/');
	} else {
		// if logged in
		next();
	}
};

router.get('/', authCheck, (req, res, next) => {
	res.render('signup', { user: req.user });
});

module.exports = router;
