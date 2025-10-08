


// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import  express from "express"


interface IReqUser{
    id:number | string,
    name:string,
    email:string
}

declare global {
    namespace Express {
        interface Request {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user? :IReqUser
        }
    }
}
export {};