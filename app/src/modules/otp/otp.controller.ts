import { Request, Response, NextFunction } from 'express';
import otpGenerator from 'otp-generator';
import { sendEmail } from '../../utils/email/email';
import { redisClient } from '../../config/redis/redisClient';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { zodOtpValidationSchema } from './otp.validation';
import { User } from '../users/user.model';


// re - write services

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const {name,email} = req.body;

    //  Validate input
    if (!email || !name) {
      return ReturnResponse(res, 400, false, 'Email and username are required');
    }

    //  Prevent multiple OTP requests
    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) {
      return ReturnResponse(
        res,
        429,
        false,
        'Please wait before requesting another OTP.',
      );
    }

    //  Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    //  Store OTP in Redis for 5 minutes
    await redisClient.setEx(`otp:${email}`, 60 * 3, otp);

    //  Send email
    await sendEmail(email, name as string, Number(otp));

    const otpDetails: {
      email: string;
      name: string;
      otp: string;
      time: number;
    } = {
      email: email,
      name: name as string,
      otp: otp,
      time: 60 * 3,
    };

    return ReturnResponse(res, 200, true, 'OTP sent successfully', otpDetails);
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp,email } = req.body;

    const otpValidationSchema = zodOtpValidationSchema.safeParse(req.body);

    if (!otpValidationSchema.success) {
      const errors = otpValidationSchema.error.format();
      return ReturnResponse(res, 400, false, 'Validation Failed', errors);
    }

  

    //  Get OTP from Redis
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp) {
      ReturnResponse(res, 400, false, 'OTP expired or not found.');
    }

    //  Compare OTP
    if (storedOtp !== otp) {
      return res.status(400).json({
        status: false,
        message: 'Invalid OTP.',
      });
    }

    //  Delete OTP after verification
    await redisClient.del(`otp:${email}`);

    ReturnResponse(res, 200, true, 'OTP verified successfully.');
  } catch (error) {
    next(error);
  }
};

const isVerifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.id;

    if (!id) {
      return ReturnResponse(res, 400, false, 'User ID not found');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true, isLoggedIn: true },
      { new: true },
    );

    if (!user) {
      return ReturnResponse(res, 404, false, 'User not found');
    }

    return ReturnResponse(res, 200, true, 'User Verify Successful');
  } catch (error) {
    next(error);
  }
};

// re -send otp

const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.user?.id;

    const userEmail = await User.findById(id);

    if (!userEmail || !userEmail.email || !userEmail.name) {
      return ReturnResponse(res, 400, false, "User email or name not found");
    }

    const { email, name } = userEmail;

    // Check existing OTP
    const isExitsOtp = await redisClient.get(`otp:${email}`);
    if (isExitsOtp) {
      return ReturnResponse(
        res,
        200,
        true,
        "Please wait 3 minutes, OTP already exists"
      );
    }

    // Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Store OTP
    await redisClient.setEx(`otp:${email}`, 60 * 3, otp);

    // Send Email
    await sendEmail(email, name, Number(otp));

    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
    });

  } catch (error) {
    next(error);
  }
};

export const otpController = {
  sendOtp,
  verifyOtp,
  isVerifyUser,
  resendOtp,
};
