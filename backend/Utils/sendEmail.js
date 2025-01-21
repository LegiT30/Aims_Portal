const nodemailer = require('nodemailer');

const sendEmail = async (to, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or another email provider
        auth: {
            user: 'chunchunmaaru106@gmail.com',
            pass: 'owxi rfnx ldcp hswy', // Use environment variables for security
        },
    });

    await transporter.sendMail({
        from: 'chunchunmaaru106@gmail.com',
        to,
        subject: 'Your OTP Code',
        text: message,
    });
};

module.exports = sendEmail;
