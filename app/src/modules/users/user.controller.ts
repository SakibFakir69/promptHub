 

// create user

import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.service';
import { User } from './user.model';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { userValidation } from './user.validation';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('create user    ');
  

  try {
    const { email } = req.body;

    const isUserExits = await User.findOne({ email: email });

    if (isUserExits) {
      return ReturnResponse(res, 401, false, 'User Already Exits');
    }

    const validationResult = userValidation.createUserSchema.safeParse(
      req.body,
    );

    if (!validationResult?.success) {
      const validationError = validationResult?.error.format();
      return ReturnResponse(
        res,
        400,
        false,
        'Zod Validation Error',
        validationError,
      );
    }

    const createUserData = validationResult.data;

    const result = await userServices.createUser(createUserData);
   

    ReturnResponse(res, 201, true, 'User created Successfully', result);
  } catch (error) {
    next(error);
  }
};

// delete user

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;

    await userServices.deleteUser(userId);

    ReturnResponse(res, 200, true, 'User Deleted Successfully');
  } catch (error) {
    next(error);
  }
};




const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?.id as string;

    const updateData: Record<string, any> = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.photo !== undefined) updateData.photo = req.body.photo;
    if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
    if (req.body.tags !== undefined) updateData.tags = req.body.tags;
    if (req.body.gender !== undefined) updateData.gender = req.body.gender;

    if (Object.keys(updateData).length === 0) {
      return ReturnResponse(res, 400, false, "No data provided to update");
    }

    const validation = userValidation.updateUserSchema.safeParse(updateData);

    if (!validation.success) {
      return ReturnResponse(
        res,
        400,
        false,
        "Zod Update Validation Error",
        validation.error.format()
      );
    }

    const result = await userServices.updateUser(user_id, validation.data);

    return ReturnResponse(
      res,
      200,
      true,
      "User Data Updated Successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


// SEARCH USER , 

const searchUser = (req:Request, res:Response, next:NextFunction)=>{
  try {
    // add many filter type  gender , age , name , etc
    // handel user search and others option 
    // pagination cursor
    
    
  } catch (error) {
    next(error);
  }
}




export const userController = {
  createUser,
  deleteUser,
  updateUser,
};
