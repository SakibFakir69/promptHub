

import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { IUserPayload } from '../types/express';



export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {


  const token = req.cookies?.accessToken ;
  

  console.log("Cookies:", req.cookies);
  console.log("Access Token:", req.cookies?.accessToken);
  console.log("Authorization:", req.headers.authorization);

  console.log(' ', token);
  // tokn 401
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  const SECRECT_KEY = process.env.BCRYPT_SECRECT_KEY as string | "token"



  Jwt.verify(token, SECRECT_KEY, (err: any, decode: any) => {
    console.log('verify');

    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ status: false, message: "Token expired" });
      }
      return res.status(403).json({ status: false, message: "Unauthorized" });
    }

    req.user = decode as IUserPayload;



    next();
  });


};
