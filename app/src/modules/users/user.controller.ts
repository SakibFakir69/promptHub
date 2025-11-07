/* eslint-disable no-unused-vars */

// create user

import { NextFunction, Request , Response } from 'express';
import { userServices } from './user.service';
import { User } from './user.model';
import { ReturnResponse } from '../../helper/ReturnResponse';



// jwt, cookies  , access , refressh token 
const createUser = async (req: Request, res: Response, next:NextFunction) => {
  console.log('create user    ');
  console.log(req.body);




  try {

  const {email} = req.body;

    const isUserExits = await User.findOne({email:email});

    if(isUserExits) 
    {
     

        ReturnResponse(res,401, false,'User Already Exits')
        
    }


    const result = await userServices.createUser(req.body);
    console.log(result);
      


    ReturnResponse(res,201,true,'User created Successfully',result);

  } catch (error) {
    next(error);

  }
};



// delete user 

const deleteUser = async (req:Request, res:Response,next:NextFunction)=>{


  try {
    const userId = req.user?.id as string;

    const result = await userServices.deleteUser(userId);


    ReturnResponse(res, 200, true,'User Deleted Successfully')

    
  } catch (error) {

    next(error);

   
    
  }


}


export const userController = {
  createUser,deleteUser
};
