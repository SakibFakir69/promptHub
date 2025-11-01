// login-user

import { Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';
import { authServices } from './auth.services';
import SetCookies from '../../utils/SetCookies';
import jwt from 'jsonwebtoken';
import { generateJwtToken } from '../../utils/genrateToken';


// logic for google id
// if user have not password then gave user to set password
// google id send viva me route

// working on getMe => logOutuser

const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('login user');
    const { email, password } = req.body;

    const isUserExits = await User.findOne({ email: email });
    console.log(email, password);

    // find user
    if (!isUserExits) {
      return res.status(401).json({
        status: false,
        message: 'User not founded',
        data: null,
      });
    }

    // compare password
    const hashPassword = isUserExits.password as string;

    const isMatchPassword = await bcrypt.compare(password, hashPassword);

    if (!isMatchPassword) {
      return res.status(404).json({
        status: false,
        message: 'Invalid credentials',
        data: null,
      });
    }

    // cdata
    const result = await authServices.loginUser(isUserExits);

    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    if (!accessToken || !refreshToken) {
      return res
        .status(500)
        .json({ status: false, message: 'Token generation failed' });
    }
    console.log(accessToken, refreshToken, ' token ');

    // setcookies
    /// access token
    SetCookies(res, 'accessToken', accessToken, 24 * 60 * 60 * 1000);
    // refresh token
    SetCookies(res, 'refreshToke', refreshToken, 24 * 60 * 60 * 1000);
    console.log('cookies set');

    return res.status(200).json({
      message: 'User Login Successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};

// password change

const ResetPassword = async (req: Request, res: Response) => {
  try {
    const { password, newPassword } = req.body;

    // old and new pass take then verify

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line no-unsafe-optional-chaining
    const email = req?.user?.id;
    console.log(email);

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(200).json({
        status: false,
        message: 'Password not match',
        data: null,
      });
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

    return res.status(200).json({
      status: true,
      message: 'password reset successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { password, newPassword } = req.body;

    // old and new pass take then verify

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line no-unsafe-optional-chaining
    const email = req?.user;

    const isUser = await User.findOne({ email: email });
    //
    if (!isUser) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(200).json({
        status: false,
        message: 'Password not match',
        data: null,
      });
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    isUser.password = hashNewPassword;

    await isUser?.save();

    return res.status(200).json({
      status: true,
      message: 'password change successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

// logout user
const logOutUser = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User Not Founded',
      });
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

    return res.status(200).json({
      status: true,
      message: 'User Log Out Successfully',
      data: null,
    });
  } catch (error) {
    console.log(error);
  }
};

// get me

const getMe = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(404).json({
        status: false,
        message: 'User not founded',
      });
    }

    const users = await authServices.getMe(user_id);

    return res.status(200).json({
      status: true,
      message: 'User login successfull',
      data: users,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: `${error.name} -> ${error.message}`,
      stack: error.stack,
    });
  }
};

// refresh token

const refreshToken = (req: Request, res: Response) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    //// verify refreshToken
    if (!refresh_token) {
      return res.status(401).json({
        status: false,
        message: 'Token expired'
      });
    }
    const refresh_secrect = process.env?.REFRESH_TOKEN_SECRET_KEY as string || 'token'
   
    jwt.verify(refresh_token,refresh_secrect , (error:any) => {
      if (error) {
        return res.status(403).json({
          status: false,
          message: 'You are not allowed to perform this action',
        });
      }

      const user = req.user;
      const jwtPayload = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    console.log(error);
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
