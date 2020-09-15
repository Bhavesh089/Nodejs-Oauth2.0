const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const mailer = require('../misc/mailer');
const randString = require('randomstring');
//Register Handle
router.post('/', (req, res) => {
	console.log(req.body);
	const { name, email, password, password2 } = req.body;
	let errors = [];
	//check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'please fill in all fields' });
	}
	//check password2
	if (password !== password2) {
		errors.push({ msg: 'Password do not match' });
	}
	// Check pass length
	if (password.length < 6) {
		errors.push({ msg: 'password should be at least 6 characters long' });
	}
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
			} else {
				// const newUser = new User();
				// newUser.metj = name;
				// newUser.userEmail = email;
				// newUser.setPassword(password);
				// newUser.secretToken = newUser.generateJWT();
				// newUser.active = false;
				const secret = randString.generate();
				const newUser = new User();

				(newUser.method = 'local'),
					(newUser.local.username = name),
					(newUser.local.userEmail = email),
					(newUser.local.secretToken = secret),
					(newUser.local.active = false);
				newUser.setPassword(password);
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
							subject: 'please verify your email ', // Subject line
							html: `please verify your email by following token
							<br/>
							Hi there,
							<br/>
							Thank you for registration!!!!!!!
							<br/>
							<b> token : ${user.local.secretToken} </b>
							on the Following page :
							<a> href = "http://localhost:3000/verifytoken"> Click here </a> ` // Plain text body
						};
						mailer.sendmessage(message);
						return res.redirect('/verifytoken');
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
