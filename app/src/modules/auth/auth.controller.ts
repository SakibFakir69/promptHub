// login-user

import { Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';

import { authServices } from './auth.services';
// add to cookies ,
// verify token store req.body = req.user
// login , and logout test
const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('login user');
    const { email, password } = req.body;

    const isUserExits = await User.findOne({ email: email });

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
  

    const accessToken = result?.token.accessToken;
    const refreshToken = result?.token.refreshToken;
    if (!accessToken || !refreshToken) {
      return res
        .status(500)
        .json({ status: false, message: 'Token generation failed' });
    }
    console.log(accessToken, refreshToken, ' token ');

    // setcookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    // refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',

      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      token: result,
    });
  } catch (error) {
    console.log(error);
  }
};

// export

export const authController = {
  loginUser,
};
