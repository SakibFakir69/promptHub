

import jwt, { SignOptions, Algorithm } from "jsonwebtoken";
import { IUser } from "../modules/users/user.interface";



export const generateJwtToken = (
  payload: Partial<IUser>,
  secret: string,
  expiresIn?: string
) => {
  if (!secret) throw new Error("JWT secret is missing");
  if (!expiresIn) throw new Error("JWT expiresIn is missing");
  if (!payload) throw new Error("JWT payload missing");

  const options: SignOptions = {
    expiresIn: "30d" ,
    algorithm: "HS256" as Algorithm        
  };

  // synchronous call
  const result= jwt.sign(payload , secret, options);

  return result;
};
