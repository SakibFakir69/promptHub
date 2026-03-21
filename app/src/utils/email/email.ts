import { BrevoClient } from '@getbrevo/brevo';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize the NEW unified Brevo Client
const brevo = new BrevoClient({ 
  apiKey: process.env.BREVO_API || 'your-api-key-here' 
});

export const sendEmail = async (toEmail: string, name: string, otp: number) => {
  try {
    // 2. Render your EJS template
    const templatePath = path.join(process.cwd(), "template", "otpEmail.ejs");
    const html = await ejs.renderFile(templatePath, { name, otp });

    // 3. Send using the new namespaced API
    // No more "new SendSmtpEmail()" - just pass a plain object!
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Your OTP Code",
      htmlContent: html,
      sender: { 
        name: "promptxhub", 
        email: process.env.SENDER_EMAIL || "your-verified-email@gmail.com" 
      },
      to: [{ email: toEmail, name: name }]
    });
    console.log("email send")

    console.log('Email sent successfully! ID:', result.messageId);
    return { success: true };

  } catch (error: any) {
    // New SDK has structured errors
    console.error('Brevo Error:', error.message);
    return { success: false, error: error.message };
  }
};