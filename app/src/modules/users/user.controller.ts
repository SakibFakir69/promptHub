/* eslint-disable no-unused-vars */

// create user

import { Request , Response } from 'express';
import { userServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  console.log('create user    ');
  console.log(req.body);

  try {
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
