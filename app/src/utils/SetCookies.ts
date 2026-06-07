




// set cookies take  ( token name , and token value )

import { Response } from "express";

const SetCookies = (res:Response, cookieName:string , cookieValue:string, maxAge:number)=>{

    res.cookie(cookieName, cookieValue,{
        httpOnly:true, 

        secure:false,
        sameSite:"none",
        maxAge,

    });
   




}

export default SetCookies;