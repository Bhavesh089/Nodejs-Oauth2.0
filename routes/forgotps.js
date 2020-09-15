const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const randString = require('randomstring');
const mailer = require('../misc/mailer');

router.get('/', (req, res, next) => {
	res.render('forgotpw');
});

router.post('/', async (req, res, next) => {
	try {
		const email = req.body.email;
		console.log(email);
		const user = await User.findOne({ 'local.userEmail': email });
		if (!user) {
			return res.render('/', { message: 'Invalid email' });
		}
		if (user) {
			token = randString.generate();
			user.local.resetpwToken = token;
			await user.save();
			const message = {
				from: 'care@fiolabs.ai', // Sender address
				to: email, // List of recipients
				subject: 'Reset password', // Subject line
				text: 'http://' + req.headers.host + '/forgotpassword/reset/' + token
			};
			return mailer.sendmessage(message);
		}
	} catch (error) {
		next(error);
	}
});
router.get('/reset/:token', (req, res, next) => {
	User.findOne({ 'local.resetpwToken': req.params.token }, (err, user) => {
		if (!user) {
			return res.redirect('/');
		}
		res.render('reset', { token: req.params.token });
	});
});

router.post('/reset/:token', async (req, res, next) => {
	User.findOne({ 'local.resetpwToken': req.params.token })
		.then((user) => {
			if (!user) {
				console.log('token expired');
				return res.redirect('back');
			}
			if (req.body.password === req.body.confirm) {
				user.setPassword(req.body.password);
				user.local.resetpwToken = '';
				user.save();
				return res.redirect('/connect');
			} else {
				console.log('password do not match');
				return res.redirect('back');
			}
		})
		.catch((err) => console.log(err));
});

module.exports = router;
