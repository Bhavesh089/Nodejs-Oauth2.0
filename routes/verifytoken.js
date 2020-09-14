const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
router.get('/', (req, res, next) => {
	res.render('verifytoken');
});

router.post('/', async (req, res, next) => {
	try {
		const token = req.body.token;
		console.log(token);
		const user = await User.findOne({ accessToken: token });
		if (!user) {
			return res.render('verifytoken', { message: 'token is expired or already used ' });
		}
		if (user) {
			user.active = true;
			user.accessToken = '';
			await user.save();
			return res.header('Authorization', 'Bearer ' + user.generateJWT()).render('connect', { user: user });
		}
	} catch (error) {
		next(error);
	}
});
module.exports = router;
