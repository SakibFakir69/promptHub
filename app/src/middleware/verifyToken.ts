 

import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { IUserPayload } from '../types/express';



export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  

  const token = req.cookies.accessToken;
  console.log(req.cookies, 'cookies');

  console.log(' ', token);
  // tokn 401
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  const SECRECT_KEY = process.env.BCRYPT_SECRECT_KEY as string | "token"

  console.log(token);
  console.log('=============================');
  console.log(SECRECT_KEY);

  Jwt.verify(token, SECRECT_KEY, (err: any, decode: any) => {
    console.log('verify');

     if (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ status: false, message: "Token expired" });
        }
        return res.status(403).json({ status: false, message: "Unauthorized" });
    }

    req.user = decode  as IUserPayload; 

    console.log(req.user, " decode");

    next();
  });

 
};
