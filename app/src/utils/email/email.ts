import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs'


// normal email send
/// use ejs
// use redish

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'fakirsakib22232@gmail.com',
    pass: 'egra xurx aebz uhmp',
  },
 
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

// send email

export const sendEmail = async (toEmail: string, name: string, otp: number) => {
  



  const templatePath = path.join(process.cwd() ,"template","otpEmail.ejs");
  // __dir , folder , file 
   
  const html =await ejs.renderFile(templatePath, {name,otp});



  const mailOptions = {
    from: 'fakirsakib22232@gmail.com',
    to: toEmail,
    subject: `Your OTP Code`,
    html
  };
 

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
console.log('send email');
