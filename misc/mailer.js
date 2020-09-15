const nodemailer = require('nodemailer');
const keys = require('../config/keys');

let transport = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: keys.mailtrap.user,
		pass: keys.mailtrap.pass
	},
	tls: {
		rejectunauthorized: false
	}
});

exports.sendmessage = (message) => {
	return transport.sendMail(message, function(err, info) {
		if (err) {
			console.log(err);
			return err;
		} else {
			console.log(info);
			return info;
		}
	});
};
