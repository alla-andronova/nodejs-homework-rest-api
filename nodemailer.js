const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { EMAIL_PASS } = process.env;

const nodemailerConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'allaitcreative@gmail.com',
    pass: EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
  const email = {
    ...data,
    from: 'allaitcreative@gmail.com',
  };
  await transporter.sendMail(email);
};

module.exports = sendEmail;
