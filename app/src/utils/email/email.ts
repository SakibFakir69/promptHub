import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: '',
  },
});

// send email

const sendEmail = async (toEmail , otp) => {
  const mailOptions = {
    from: 'me',
    to: toEmail,
    subject: `You reset password otp ${ otp}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred:', error);
      // res.status(500).send('Error in sending email. Please try again later.');
    } else {
      console.log('Email sent:', info.response);
      // res.send('Email sent successfully!');
    }
  });
};
