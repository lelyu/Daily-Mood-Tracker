const sgMail = require('@sendgrid/mail')

const sendEmail = (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	send_to = req.body.email

	const msg = {
		to: send_to,
		from: 'lyulelok@gmail.com',
		subject: 'Your Password Reset Link',
		text: 'Hello, here is your password reset link',
		html: '<a>https://this_is_a_link</a>',
	}

	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent')
		})
		.catch((error) => {
			console.error(error)
		})
}

module.exports = sendEmail
