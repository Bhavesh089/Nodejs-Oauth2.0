const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const mailer = require('../misc/mailer');
const randString = require('randomstring');
const captchaSecret = require('../config/keys');
const request = require('request');
//Register Handle
router.post('/', (req, res) => {
	console.log(req.body);
	const { name, email, password, password2 } = req.body;
	const CaptchaResponse = req.body['g-recaptcha-response'];
	let errors = [];
	let recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify?';
	recaptcha_url += 'secret=' + captchaSecret.googleCaptcha.secret + '&';
	recaptcha_url += 'response=' + CaptchaResponse + '&';
	recaptcha_url += 'remoteip=' + req.connection.remoteAddress;

	//check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Please fill in all fields' });
	}

	if (!name.match('^[a-zA-Z ]*$')) {
		errors.push({ msg: 'Only Characters with white space are allowed' });
	}

	if (!email.match('^[a-zA-Z0-9]+(.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,15})$')) {
		errors.push({ msg: 'Enter valid email address' });
	}
	//check password2
	if (password !== password2) {
		errors.push({ msg: 'Password do not match' });
	}

	// Check pass length
	if (password.length < 8) {
		errors.push({ msg: 'Password should be at least 8 characters long' });
	}

	if (!password.match('(?=.*?[#?!@$%^&*-])')) {
		errors.push({ msg: 'Password must contain at least one special character ' });
	}
	if (!password.match('(?=.*?[0-9])')) {
		errors.push({ msg: 'Password must contain at least one number ' });
	}
	//check captcha response
	if (!CaptchaResponse) {
		errors.push({ msg: 'Please validate captcha' });
	}

	request(recaptcha_url, function(error, res, body) {
		body = JSON.parse(body);
		if (body.success !== undefined && !body.success) {
			return errors.push({ message: 'Captcha validation failed' });
		}
	});

	if (errors.length > 0) {
		res.render('Register', {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		User.findOne({ 'local.userEmail': email }).then((user) => {
			if (user) {
				errors.push({ msg: 'Email is already exists' });
				res.render('Register', {
					errors,
					name,
					email,
					password,
					password2
				});
				console.log('errors');
			} else {
				// const newUser = new User();
				// newUser.metj = name;
				// newUser.userEmail = email;
				// newUser.setPassword(password);
				// newUser.secretToken = newUser.generateJWT();
				// newUser.active = false;

				const newUser = new User();

				(newUser.method = 'local'),
					(newUser.local.username = name),
					(newUser.local.userEmail = email),
					(newUser.local.active = false);
				newUser.setPassword(password);
				const secret = newUser.generateJWT();
				const url = 'http://' + req.headers.host + '/verify/' + secret;
				// newUser.local.setPassword(password);
				// const newUser = new User({
				// 	username: name,
				// 	userEmail: email,
				// 	password: User.set
				// });
				console.log(req.user);
				newUser
					.save()
					.then((user) => {
						console.log(user);

						const message = {
							from: 'care@fiolabs.ai', // Sender address
							to: email, // List of recipients
							subject: 'FIO CARE email registration confirmation', // Subject line
							html: `Hello ${user.local.username}, 
							<p>
							Thank you for registering for FIO CARE. We are excited to help you acquire, retain and engage your customers.  
							</p>
							<p>To confirm your registration, please click on the following link:
							 <a href="${url}">${url}</a></p>
							<p>
							 Any doubts or question? 
							</p>
							<p>Email us at <a href = "support@fiolabs.ai" >support@fiolabs.ai</a> we will be happy to help.</p>
							<p>
							We are excited to see how CARE will elevate your business. 
							</p>
							<p>
							Thank You,  
							</p>
							<p>
							Team FIO CARE. </p>` // Plain text body
						};
						mailer.sendmessage(message);
						req.flash('success_msg', 'Please check you email for confirmation');
						return res.redirect('/');
						// return res
						// 	.header('Authorization', 'Bearer ' + user.generateJWT())
						// 	.render('connect', { user: user });
					})
					.catch((err) => console.log(err));

				// bcrypt.genSalt(10, (err, salt) =>
				// 	bcrypt.hash(newUser.password, salt, (err, hash) => {
				// 		if (err) throw err;
				// 		//set password to hashed
				// 		newUser.password = hash;
				// 		//save user
				// 		newUser
				// 			.save()
				// 			.then((user) => {
				// 				res.redirect('/connect');
				// 			})
				// 			.catch((err) => console.log(err));
				// 	})
				// );
			}
		});
	}
});

router.get('/', (req, res, next) => {
	res.render('Register');
});

module.exports = router;
