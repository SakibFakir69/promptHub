import { sendEmail } from './../../utils/email/email';
import otpGenerator from 'otp-generator';
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';
import { authServices } from './auth.services';
import SetCookies from '../../utils/SetCookies';
import jwt from 'jsonwebtoken';
import { generateJwtToken } from '../../utils/genrateToken';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { authValidator } from './auth.validation';
import { redisClient } from '../../config/redis/redisClient';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('login user');
    const { email, password } = req.body;

    const zodValidation = authValidator.loginUserValidationSchema.safeParse(
      req.body,
    );

    if (!zodValidation.success) {
      const errors = zodValidation?.error.format();
      return ReturnResponse<typeof errors>(
        res,
        400,
        false,
        'Validation failed',
        errors,
      );
    }

    const isUserExits = await User.findOne({ email: email });
   

    // find user
    if (!isUserExits) {
      ReturnResponse(res, 401, false, 'User not founded');
      return;
    }

    // compare password
    const hashPassword = isUserExits?.password as string;

    const isMatchPassword = await bcrypt.compare(password, hashPassword);

    if (!isMatchPassword) {
      ReturnResponse(res, 404, false, 'Invalid credentials');
      return;
    }

    // cdata
    const payload = {
      _id: isUserExits?._id as unknown as string,

      name: isUserExits?.name as string,
      email: isUserExits?.email as string,
    };

    const result = await authServices.loginUser(payload);

    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    if (!accessToken || !refreshToken) {
      ReturnResponse(res, 500, false, 'Token generation failed');
      return;
    }
    

    // setcookies
    /// access token
    SetCookies(res, 'accessToken', accessToken, 24 * 60 * 60 * 1000);
    // refresh token
    SetCookies(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000);
    console.log('cookies set');

    return res.status(200).json({
      message: 'User Login Successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
      data:{
         isVerify:isUserExits.isVerify
      }
    });
  } catch (error) {
    next(error);
  }
};

// password change

const ResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { newPassword, confirmPassword,email} = req.body;

    if(!newPassword || !confirmPassword || !email)
    {
      return ReturnResponse(res,400,false,'Something missing')
    }
    if(newPassword!==confirmPassword)
    {
      return ReturnResponse(res,400,false,"Password not match");
    }

    // zod validation
    const zodValidation = authValidator.resetPasswordSchema.safeParse(req.body);

    if (!zodValidation?.success) {
      const errors = zodValidation.error.format();
      return ReturnResponse(res, 400, false, 'Validation failed', errors);
    }

    // old and new pass take then verify

    
   

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {
      ReturnResponse(res, 404, false, 'User not found');
      return;
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

    return ReturnResponse(res, 200, true, 'password reset successfully');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, newPassword } = req.body;

    // zod validation
    const zodValidation = authValidator.changePasswordSchema.safeParse(
      req.body,
    );

    if (!zodValidation?.success) {
      const errors = zodValidation?.error.format();
      return ReturnResponse(res, 400, false, 'Validation Failed', errors);
    }

    // old and new pass take then verify

    const email = req?.user?.email;
    

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {
      ReturnResponse(res, 404, false, 'User not found');
      return;
    }

    const isMatchPassword = await bcrypt.compare(
      password as string,
      isUser?.password as string,
    );

    if (!isMatchPassword) {
      ReturnResponse(res, 200, false, 'Password not match');
      return;
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

    ReturnResponse(res, 200, false, 'password change successfully');
    return;
  } catch (error) {
    next(error);
  }
};

// logout user
const logOutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req?.user?.id;

    const user = await User.findById(user_id);

    if (!user) {
      ReturnResponse(res, 404, false, 'User Not Founded');
      return;
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    ReturnResponse(res, 200, true, 'User Log Out Successfully');
  } catch (error) {
    next(error);
  }
};

// get me

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      ReturnResponse(res, 404, false, 'User not founded');
      return;
    }

    const users = await authServices.getMe(user_id);

    ReturnResponse(res, 200, true, 'User data Retrieve successfully', users);
  } catch (error: any) {
    next(error);
  }
};

// refresh token

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    //// verify refreshToken
    if (!refresh_token) {
      ReturnResponse(res, 401, false, 'Token expired');
      return;
    }

    const refresh_secrect =
      (process.env?.REFRESH_TOKEN_SECRET_KEY as string) || 'token';

    jwt.verify(refresh_token, refresh_secrect, (error: any) => {
      if (error) {
        ReturnResponse(
          res,
          403,
          false,
          'You are not allowed to perform this action',
        );
        return;
      }

      const user = req.user;
      const jwtPayload = {
        id: user?.id,

        email: user?.email,
        name: user?.name,
      };
      const accesScerect: string = process.env.BCRYPT_SECRECT_KEY as
        | string
        | 'token';
      const accessToken = generateJwtToken(jwtPayload, accesScerect, '30m');

      return res.status(201).json({
        accessToken: accessToken,
      });
    });
  } catch (error) {
    next(error);
  }
};

// reset-email 



const resetEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body; 
    if (!email) {
      return ReturnResponse(res, 400, false, "Please provide email address");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ReturnResponse(res, 404, false, 'User Email Not Found');
    }

  
    const isExitsOtp = await redisClient.get(`otp:${email}`);
    if (isExitsOtp) {
   
      return ReturnResponse(res, 429, false, "OTP already sent. Please wait 5 minutes before requesting a new one.");
    }

    // 2. Generate OTP (Keep as string to preserve leading zeros)
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // 3. Store in Redis (5 minutes = 300 seconds)
    await redisClient.setEx(`otp:${email}`, 300, otp);

   
    await sendEmail(user.email, 'Password Reset OTP', Number(otp));

    return ReturnResponse(res, 200, true, "OTP sent successfully to your email");

  } catch (error) {
    next(error);
  }
}

// reset-code
const resetCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body; 
    console.log(email,otp)

    if (!email || !otp) {
      return ReturnResponse(res, 400, false, 'Email and OTP are required');
    }

    
    const storedOtp = await redisClient.get(`otp:${email}`);

 
    if (!storedOtp) {
      return ReturnResponse(res, 400, false, 'OTP expired');
    }

   
    if (storedOtp !== otp) {
      return ReturnResponse(res, 400, false, 'Invalid OTP code');
    }

   
    await redisClient.del(`otp:${email}`);

    return ReturnResponse(res, 200, true, 'OTP verified successfully');

  } catch (error) {
    next(error);
  }
}


const resendRestCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ReturnResponse(res, 400, false, 'Please provide email address');
    }

    const isUserExits = await User.findOne({ email: email });
    if (!isUserExits) {
      return ReturnResponse(res, 400, false, 'User with this email does not exist');
    }

    
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const storeOtp = await redisClient.get(`otp:${email}`);
    if(storeOtp)
    {
      return ReturnResponse(res,400,false,'Please wait 3 minutes')
    }

   
    await redisClient.setEx(`otp:${email}`, 300, otp);

    
    await sendEmail(email, 'Password Reset OTP', Number(otp)); 

    return ReturnResponse(res, 200, true, "OTP sent successfully to your email");
    
  } catch (error) {
    next(error);
  }
}

// export
export const authController = {
  loginUser,
  ResetPassword,
  changePassword,
  getMe,
  logOutUser,
  refreshToken,
  resetEmail,
  resetCode,
  resendRestCode
};
