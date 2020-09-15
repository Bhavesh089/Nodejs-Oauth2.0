const express = require('express');
const router = express.Router();
// const User = require('../models/user-model');
router.get('/', (req, res, next) => {
	res.render('forgotsendemail');
});

// router.post('/', async (req, res, next) => {
// 	try {
// 		const token = req.body.token;
// 		console.log(token);
// 		const user = await User.findOne({ 'local.secretToken': token });
// 		if (!user) {
// 			return res.render('verifytoken', { message: 'token is expired or already used ' });
// 		}
// 		if (user) {
// 			user.local.active = true;
// 			user.local.secretToken = '';
// 			await user.save();
// 			return res.redirect('/register');
// 		}
// 	} catch (error) {
// 		next(error);
// 	}
// });
module.exports = router;
