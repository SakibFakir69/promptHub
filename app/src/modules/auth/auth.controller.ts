// login-user

import { NextFunction, Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';
import { authServices } from './auth.services';
import SetCookies from '../../utils/SetCookies';
import jwt from 'jsonwebtoken';
import { generateJwtToken } from '../../utils/genrateToken';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { authValidator } from './auth.validation';


const loginUser = async (req: Request, res: Response , next:NextFunction) => {
  try {
    console.log('login user');
    const { email, password } = req.body;

    const zodValidation = authValidator.loginUserValidationSchema.safeParse(req.body);

    if(!zodValidation.success)
    {
      const errors = zodValidation?.error.format();
      return ReturnResponse <typeof errors>(res, 400, false, 'Validation failed', errors )
    }



    const isUserExits = await User.findOne({ email: email });
    console.log(email, password);

    // find user
    if (!isUserExits) {

     

      ReturnResponse(res, 401, false,'User not founded');
      return;
    }

    // compare password
    const hashPassword = isUserExits?.password as string;

    const isMatchPassword = await bcrypt.compare(password, hashPassword);

    if (!isMatchPassword) {

     
      ReturnResponse(res,404,false, 'Invalid credentials')
      return;
    }

    // cdata
    
    const result = await authServices.loginUser(isUserExits);

    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    if (!accessToken || !refreshToken) {
      

        ReturnResponse(res,500,false,'Token generation failed')
        return;
    }
    console.log(accessToken, refreshToken, ' token ');

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
    });
  } catch (error) {
    next(error);

    
  }
};

// password change

const ResetPassword = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const { newPassword } = req.body;

        // zod validation 
    const zodValidation =authValidator.resetPasswordSchema.safeParse(req.body);


    if(!zodValidation?.success)
    {
      const errors = zodValidation.error.format();
      return ReturnResponse(res, 400, false, 'Validation failed',errors );

    }


    

    // old and new pass take then verify

     

     
    const email = req?.user?.id;
    console.log(email);

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {
      

      ReturnResponse(res,404,false,'User not found');
      return;
    }

    
   
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

   

    return ReturnResponse(res, 200, true,'password reset successfully');
    

  } catch (error) {
       next(error);
  }
};

const changePassword = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { password, newPassword } = req.body;



    // zod validation 
    const zodValidation = authValidator.changePasswordSchema.safeParse(req.body);

    if(!zodValidation?.success)
    {
      const errors = zodValidation?.error.format();
      return ReturnResponse(res, 400, false, "Validation Failed",errors )
    }

    // old and new pass take then verify

     

     
    const email = req?.user;

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {

      
      ReturnResponse(res,404,false,'User not found');
      return;
    }

    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if (!isMatchPassword) {

     

      ReturnResponse(res,200,false,'Password not match');
      return;
    }


    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

    ReturnResponse(res,200,false,'password change successfully');
    return;

  } catch (error) {
       next(error);
  }
};

// logout user
const logOutUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const user_id = req.user?.id;
    const user = await User.findById(user_id);

    if (!user) {
;
      ReturnResponse(res,404,false,'User Not Founded');
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

  
    ReturnResponse(res,200,true,'User Log Out Successfully');

  } catch (error) {
       next(error);
  }
};

// get me

const getMe = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {

      
      ReturnResponse(res,404,false,'User not founded');
      return;
    }

    const users = await authServices.getMe(user_id);

   
    ReturnResponse(res,200,true, 'User login successfull',users)

     
  } catch (error: any) {
       next(error);
  }
};

// refresh token

const refreshToken = (req: Request, res: Response,next:NextFunction) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    //// verify refreshToken
    if (!refresh_token) {

      
      ReturnResponse(res,401,false,'Token expired');
      return;
    }

    const refresh_secrect = process.env?.REFRESH_TOKEN_SECRET_KEY as string || 'token'
   
    jwt.verify(refresh_token,refresh_secrect , (error:any) => {
      if (error) {

        
        ReturnResponse(res,403,false,'You are not allowed to perform this action');
        return;
      }

      const user = req.user;
      const jwtPayload = {
         
        id: user?._id,

        email: user?.email,
        name: user?.name,
      };
      const accesScerect: string = process.env.BCRYPT_SECRECT_KEY as
        | string
        | 'token';
      const accessToken = generateJwtToken(jwtPayload, accesScerect, '30m');

      return  res.status(201).json({
        accessToken:accessToken
      })

    });
  } catch (error) {
       next(error);
  }
};

// export
export const authController = {
  loginUser,
  ResetPassword,
  changePassword,
  getMe,
  logOutUser,
  refreshToken
};
