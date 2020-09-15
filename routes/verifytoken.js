const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const secret = require('../config/keys');

router.get('/:token', async (req, res, next) => {
	try {
		const token = req.params.token;
		console.log(token);
		// const user = await User.findOne({ 'local.secretToken': token });
		jwt.verify(token, secret.Jwt.secret, (err, user) => {
			if (err) return req.flash({ failure_regmsg: 'something went wrong or try signup again' });

			User.findById(user.id).then((currUser) => {
				if (currUser) {
					currUser.local.active = true;
					currUser.save();
					req.flash('success_loginmsg', 'Successfully verified, you can login');
					return res.redirect('/register');
				}
				if (!currUser) {
					req.flash({ failure_regmsg: 'something went wrong or try signup again' });
					return res.redirect('/register');
				}
			});
		});
	} catch (error) {
		next(error);
	}
});
module.exports = router;
