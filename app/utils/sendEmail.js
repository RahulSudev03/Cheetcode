// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (userEmail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Cheetcode" <${process.env.EMAIL_USER}>`, // sender address
    to: userEmail, // list of receivers
    subject: "Waitlist Confirmation", // Subject line
    text: "Waitlist confirmation", // plain text body
    html: "Thank you for joining our waitlist!", // html body
  };

  await transporter.sendMail(mailOptions);
};