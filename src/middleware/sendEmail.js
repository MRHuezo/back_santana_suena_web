const nodemailer = require('nodemailer');

const sendEmail = {};

sendEmail.sendEmail = async (emailAdmin,action,htmlContent,service) => {
	try {

		const transporter = await nodemailer.createTransport({
			host: process.env.HOST_EMAIL,
			port: process.env.PORT_EMAIL,
			secure: false,
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.PASS_EMAIL
			},
			tls: {
				rejectUnauthorize: false
			}
		})
	
		const info = await transporter.sendMail({
			from:` ${service} <${process.env.USER_EMAIL}>`,
			to: emailAdmin,
			subject: action,
			html: htmlContent,
		})
		transporter.close()
		
		return info;
	} catch (error) {
		console.log(error)
	}
	
}


module.exports = sendEmail;