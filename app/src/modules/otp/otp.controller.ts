import { Request, Response } from "express";

// add redish 



const sendOtp = async (req:Request , res:Response)=>{

    try {


        // call emailSend() 
        // set otp , 
        // add redis for cach

        // email

        const {email} = req.body;
        const user_name = req.user?.name;

        




        
    } catch (error) {
        console.log(error)
        
    }

}


const verifyOtp = (req:Request , res:Response)=>{


    try {
        // recive email and otp
        // otp check 
        // pass to reset password
        // checl redish and remove otp 

        const {email , otp} = req.body;



        
    } catch (error) {

        console.log(error);
        
    }


}


export const otpController = {
    verifyOtp, sendOtp
}