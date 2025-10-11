// login-user

import { Request, Response } from 'express';
import { User } from '../users/user.model';
import bcrypt from 'bcryptjs';

import { authServices } from './auth.services';

// log out based time , email send , get user  , logout , test 

const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('login user');
    const { email, password } = req.body;

    const isUserExits = await User.findOne({ email: email });
    console.log(email , password)

    // find user
    if (!isUserExits) {
      return res.status(401).json({
        status: false,
        message: 'User not founded',
        data: null,
      });
    }

    // compare password
    const hashPassword = isUserExits.password as string;

    const isMatchPassword = await bcrypt.compare(password, hashPassword);

    if (!isMatchPassword) {
      return res.status(404).json({
        status: false,
        message: 'Invalid credentials',
        data: null,
      });
    }

    // cdata
    const result = await authServices.loginUser(isUserExits);
  

    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    if (!accessToken || !refreshToken) {
      return res
        .status(500)
        .json({ status: false, message: 'Token generation failed' });
    }
    console.log(accessToken, refreshToken, ' token ');

    // setcookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge:24 * 60 * 60 * 1000, 
    });
    // refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',

      maxAge: 15 * 60 * 60 * 1000,
    });
    console.log("cookies set")

    return res.status(200).json({
      message:"User Login Successfully",
      accessToken:accessToken,
      refreshToken:refreshToken
    });
  } catch (error) {
    console.log(error);
  }
};



// password change

const ResetPassword  =async (req:Request, res:Response)=>{


  try {
    const {password,newPassword} = req.body;

    // old and new pass take then verify

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line no-unsafe-optional-chaining
    const email = req?.user?.email;

   

    const isUser = await User.findOne({email:email});
    // 
    if (!isUser) {
  return res.status(404).json({
    status: false,
    message: "User not found",
  });
}
   
    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if(!isMatchPassword)
    {
      return res.status(200).json({
        status:false,
        message:"Password not match",
        data:null
      })
    }
    const hashNewPassword  =await  bcrypt.hash(newPassword, 10);
    isUser.password=hashNewPassword;


    await isUser?.save();



   

   
    

  


    return res.status(200).json({
      status:true,
      message:"password change successfully",
     
      
     
  
    })
    


    
  } catch (error) {

    console.log(error);
  }


}


const changePassword  =async (req:Request, res:Response)=>{


  try {
    const {password,newPassword} = req.body;

    // old and new pass take then verify

    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // eslint-disable-next-line no-unsafe-optional-chaining
    const email = req?.user?.email;

   

    const isUser = await User.findOne({email:email});
    // 
    if (!isUser) {
  return res.status(404).json({
    status: false,
    message: "User not found",
  });
}
   
    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if(!isMatchPassword)
    {
      return res.status(200).json({
        status:false,
        message:"Password not match",
        data:null
      })
    }
    const hashNewPassword  =await  bcrypt.hash(newPassword, 10);
    isUser.password=hashNewPassword;


    await isUser?.save();



   

   
    

  


    return res.status(200).json({
      status:true,
      message:"password change successfully",
     
      
     
  
    })
    


    
  } catch (error) {

    console.log(error);
  }


}






// export
export const authController = {
  loginUser,ResetPassword , changePassword
};
