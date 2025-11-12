import { Request, Response,NextFunction } from "express";
import otpGenerator from "otp-generator";
import { sendEmail } from "../../utils/email/email";
import { redisClient } from "../../config/redis/redisClient";
import { ReturnResponse } from "../../helper/ReturnResponse";
import { zodOtpValidationSchema } from "./otp.validation";



// re - write services 


const sendOtp = async (req: Request, res: Response,next:NextFunction) => {
  try {
     const email = req.user?.email;
    const user_name = req.user?.name;

    //  Validate input
    if (!email || !user_name) {
     

   return ReturnResponse(res, 400, false,"Email and username are required")
    }

    //  Prevent multiple OTP requests
    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) {
      
      ReturnResponse(res, 429,false,"Please wait before requesting another OTP.")
    }

    //  Generate OTP
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    //  Store OTP in Redis for 5 minutes
    await redisClient.setEx(`otp:${email}`, 60 * 5, otp);

    //  Send email
    await sendEmail(email, user_name as string,Number( otp));

   
      const  otpDetails:{email:string,user_name:string,otp:string, time:number}={
        email:email,
        user_name:user_name as string,
        otp:otp,
        time:60*5
      }
    

   return  ReturnResponse(res, 200,true,"OTP sent successfully",otpDetails)

  } catch (error) {
       next(error);
  }
};

const verifyOtp = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { otp } = req.body;

    const otpValidationSchema = zodOtpValidationSchema.safeParse(otp);


    const email = req.user?.email;

    //  Get OTP from Redis
    const storedOtp = await redisClient.get(`otp:${email}`);

    console.log(storedOtp)

    if (!storedOtp) {
     
      ReturnResponse(res,400,false,"OTP expired or not found.")
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

   

    ReturnResponse(res, 200,true,"OTP verified successfully.")

  } catch (error) {
       next(error);
  }
};

export const otpController = {
  sendOtp,
  verifyOtp,
};
