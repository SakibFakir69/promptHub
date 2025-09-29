// login-user

import { Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';

import { authServices } from './auth.services';
// add to cookies , 
// verify token store req.body = req.user
const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("login user")
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
    console.log(result);

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
