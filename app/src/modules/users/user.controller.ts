/* eslint-disable no-unused-vars */

// create user

import { NextFunction, Request , Response } from 'express';
import { userServices } from './user.service';
import { User } from './user.model';



// jwt, cookies  , access , refressh token 
const createUser = async (req: Request, res: Response, next:NextFunction) => {
  console.log('create user    ');
  console.log(req.body);




  try {

  const {email} = req.body;

    const isUserExits = await User.findOne({email:email});

    if(isUserExits)
    {
        return res.status(401).json({
            status:false,
            message:"User Already Exits",
            data:isUserExits.email

        })
        
    }


    const result = await userServices.createUser(req.body);
    console.log(result);
      

    res.status(201).json({
      status: true,
      message: 'User created Successfully',
      data: result,
    });

  } catch (error) {
    next(error);

  }
};



// delete user 

const deleteUser = async (req:Request, res:Response,next:NextFunction)=>{


  try {
    const userId = req.user?.id as string;

    const result = await userServices.deleteUser(userId);

    return res.status(200).json({
      status:true,
      message:"User Deleted Successfully"
    })


    
  } catch (error) {

    next(error);

   
    
  }


}


export const userController = {
  createUser,deleteUser
};
