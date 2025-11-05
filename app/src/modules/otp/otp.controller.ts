import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import { sendEmail } from "../../utils/email/email";
import { redisClient } from "../../config/redis/redisClient";



// re - write services 


const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user_name = req.user?.name;

    // ✅ Validate input
    if (!email || !user_name) {
      return res.status(400).json({
        status: false,
        message: "Email and username are required.",
      });
    }

    // ✅ Prevent multiple OTP requests
    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) {
      return res.status(429).json({
        status: false,
        message: "Please wait before requesting another OTP.",
      });
    }

    // ✅ Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // ✅ Store OTP in Redis for 5 minutes
    await redisClient.setEx(`otp:${email}`, 60 * 5, otp);

    // ✅ Send email
    await sendEmail(email, user_name,Number( otp));

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    //  Get OTP from Redis
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        status: false,
        message: "OTP expired or not found.",
      });
    }

    //  Compare OTP
    if (storedOtp !== otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP.",
      });
    }

    //  Delete OTP after verification
    await redisClient.del(`otp:${email}`);

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

export const otpController = {
  sendOtp,
  verifyOtp,
};
