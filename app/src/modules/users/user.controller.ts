/* eslint-disable no-unused-vars */

// create user

import { Request , Response } from 'express';
import { userServices } from './user.service';
import { User } from './user.model';

const createUser = async (req: Request, res: Response) => {
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
    console.log(error);
  }
};

export const userController = {
  createUser,
};
