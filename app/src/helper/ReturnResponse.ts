import {  Response } from "express";




export const ReturnResponse = <T>(res:Response,code:number, status:boolean, message:string, data?:T)=>{


    return res.status(code).json({
        status:status,
        message:message,
        data:data
    })



}