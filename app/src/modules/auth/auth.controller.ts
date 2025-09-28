// login-user

import { Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken'

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email , password } = req.body;

    const isUserExits = await User.findOne({ email: email });

    if (!isUserExits) {
      return res.status(401).json({
        status: false,
        message: 'User not founded',
        data: null,
      });
    }

    // compare password , create jwt
    const hashPassword = isUserExits.password as string;

    const isMatchPassword= await bcrypt.compare(password, hashPassword);

    if(!isMatchPassword)
    {
        return res.status(404).json({
             status: false,
        message: "Invalid credentials",
        data: null,
        })
    }

    // create payload



    const payload:{
        id:number,
        email:string,
        name:string
    } = {
        id:isUserExits._id,
        email:isUserExits.email,
        name:isUserExits.name

    }
    // make token on jwt
    const jwtToken = await jwt.sign(password,process.env.BCRYPT_SECRECT_KEY , {
        expiresIn:"7d"
    }) as JwtPayload;


    return res.status(200).json({
        status:true,
        message:"User Successfully login",
        token:{
            token:jwtToken
            
        }
    })


  } catch (error) {
    console.log(error);
  }
};

// export

export const authController = {
  loginUser,
};
