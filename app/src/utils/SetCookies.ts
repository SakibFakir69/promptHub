




// set cookies take  ( token name , and token value )

import { Response } from "express";

const SetCookies = (res: Response, cookieName: string, cookieValue: string, maxAge: number) => {

    const isProd = process.env.NODE_ENV === "production";

    res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge,
    });

}

export default SetCookies;