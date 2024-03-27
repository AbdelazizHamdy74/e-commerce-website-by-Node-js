const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  //1 >> Create transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: true, // Use `true` for port 465, `false` for all other ports
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //2 >> define email options
  const mailOptions = {
    from: `SHOP APP <abdelazezkhattab@gmail.com>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  //3 >> send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
