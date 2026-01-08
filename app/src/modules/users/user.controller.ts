 

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
    const user_id = req.user?.id  as string;

    const updateData = {
      name: req.body.name,
      bio: req.body.bio,
      photo: req.body.photo,
      avatar: req.body.avatar,
      tags: req.body.tags,
      // extend as need
    };

    // zod validation
    const updateDataValidation =
      userValidation.updateUserSchema.safeParse(updateData);

    if (!updateDataValidation?.success) {
      const updateError = updateDataValidation?.error.format();
      return ReturnResponse(
        res,
        400,
        false,
        'Zod Update Validation Error',
        updateError,
      );
    }

    const updatedData = updateDataValidation?.data;

    // update services

    const result = await userServices.updateUser(
      user_id ,
      updatedData,
    );

    return ReturnResponse(
      res,
      200,
      true,
      'User Data Update Successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
  deleteUser,
  updateUser,
};
