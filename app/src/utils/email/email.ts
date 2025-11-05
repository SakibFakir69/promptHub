import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs'
import { email } from 'zod';

// normal email send
/// use ejs
// use redish

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fakirsakib22232@gmail.com',
    pass: 'egra xurx aebz uhmp',
  },
});

// send email

export const sendEmail = async (toEmail: string, name: string, otp: number) => {
  console.log(toEmail, name, otp, ' email ');



  const templatePath = path.join(process.cwd() ,"template","otpEmail.ejs");
  // __dir , folder , file 
   
  const html =await ejs.renderFile(templatePath, {name,otp});



  const mailOptions = {
    from: 'fakirsakib22232@gmail.com',
    to: toEmail,
    subject: `Yout OTP Code`,
    html
  };
  console.log(mailOptions);

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
console.log('send email');
