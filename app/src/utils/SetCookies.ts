




// set cookies take  ( token name , and token value )

import { Response } from "express";

const SetCookies = (res:Response, cookieName:string , cookieValue:string, maxAge:number)=>{

    res.cookie(cookieName, cookieValue,{
        httpOnly:true, /// can not access with js 

        secure:process.env.NODE_ENV==='production', 
        sameSite:"none",
        maxAge,

    });
   




}

export default SetCookies;