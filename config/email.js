const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Company Name" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html, // Change 'text' to 'html' for formatting support
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


module.exports = sendEmail;
