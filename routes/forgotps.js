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
			req.flash('error_msg', 'Email not found, kindly registry or retype!');
			return res.redirect('/forgotpassword');
		}

		if (user) {
			token = user.generateJWT();
			user.local.resetpwToken = token;
			await user.save();
			const url = 'http://' + req.headers.host + '/forgotpassword/reset/' + token;
			const message = {
				from: 'care@fiolabs.ai', // Sender address
				to: email, // List of recipients
				subject: 'FIO CARE Password reset ', // Subject line
				html: `Hello ${user.local.username}, 
							<p>
							You recently requested to reset your password for your FIO CARE account click the reset button to reset it.   
							</p>
							<button type="button" href = "${url}">Reset</button>
							<p>If you did not request a password reset, please ignore this email.</p>
							<p>
							 Any doubts or question? 
							</p>
							<p>Email us at <a href = "support@fiolabs.ai" >support@fiolabs.ai</a> we will be happy to help.</p>
							<p>If you are having trouble clinking the password reset button please copy and paste the URL below into your web browser: 
							<a href="${url}">${url}</a> </p>
							<p>
							Thank You,  
							</p>
							<p>
							Team FIO CARE. </p>` // Plain text body
			};
			mailer.sendmessage(message);
			req.flash('success_loginmsg', 'Reset password link has been sent to your email!');
			return res.redirect('/forgotpassword');
		}
	} catch (error) {
		next(error);
	}
});

router.get('/reset/:token', (req, res, next) => {
	User.findOne({ 'local.resetpwToken': req.params.token })
		.then((user) => {
			if (!user) {
				req.flash('error_msg', 'token is expired or user donot found!');
				return res.redirect('/');
			}
			if (user) {
				return res.render('reset', { token: req.params.token });
			}
		})
		.catch((err) => console.log(err));
});

// router.get('/reset', (req, res, next) => {
// 	res.render('reset', { token: req.params.token });
// });

router.post('/reset/:token', async (req, res, next) => {
	User.findOne({ 'local.resetpwToken': req.params.token })
		.then((user) => {
			const { password, confirm } = req.body;
			let errors = [];

			if (!user) {
				console.log('token expired');
				req.flash('error_msg', 'token is expired or user donot found!');
				return res.redirect('back');
			}
			if (!password || !confirm) {
				errors.push({ msg: 'please fill in all fields' });
			}
			//check password2
			if (password !== confirm) {
				errors.push({ msg: 'Password do not match' });
			}
			// Check pass length
			if (password.length < 8) {
				errors.push({ msg: 'password should be at least 8 characters long' });
			}
			if (user.validPassword(password)) {
				errors.push({ msg: "Can't set old password as new password" });
			}
			if (errors.length > 0) {
				res.render('reset', {
					errors,
					password,
					confirm
				});
			} else {
				user.setPassword(password);
				user.local.resetpwToken = '';
				user.save();
				req.flash('success_loginmsg', 'Successfully updated password now you may login!');
				return res.redirect('/login');
			}
			// if (req.body.password === req.body.confirm) {
			// 	user.setPassword(req.body.password);
			// 	user.local.resetpwToken = '';
			// 	user.save();
			// 	req.flash('success_loginmsg', 'Successfully updated password now you may login!');
			// 	return res.redirect('/register');
			// } else {
			// 	console.log('password do not match');
			// 	req.flash('error_msg', 'password do not match');
			// 	return res.redirect('back');
			// }
		})
		.catch((err) => console.log(err));
});

module.exports = router;
