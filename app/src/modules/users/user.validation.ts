import { z } from "zod";

import { GenderEnum } from './user.interface';

export interface IUser {
  // _id: string;

  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  googleId: string;
  gender: string;
  totalPost: number;
  tags: string[];
  follower: string[];
  following: string[];
  isVerify: boolean;
  isBlock: boolean;
  isDelete: boolean;
  isLoggedIn: boolean;
  // id: string; /// virtual id
}

const createUserSchema = z.object({
  name: z.string().min(4, { message: 'Name must be 4 length' }),
  email: z.string().email({ message: 'Invalid email address' }),

  password: z.string().min(6, { message: 'Password must be 6 length' }),
  bio: z.string().optional().default(''),
  photo: z.string().optional(),
  avatar: z.string().optional().default(''),
  googleId: z.string().optional().default(''),
  totalPost: z.number().default(0),
 gender: z
  .nativeEnum(GenderEnum)
  .optional()
  .refine(
    (val) =>
      val === undefined ||
      Object.values(GenderEnum).includes(val),
    {
      message: "Gender must be male, female, or others",
    }
  ),


  tags: z.array(z.string()).optional(),

  isVerify: z.boolean().optional(),
  isBlock: z.boolean().optional(),
  isDelete: z.boolean().optional(),
  isLoggedIn: z.boolean().optional(),
});

// update user

const updateUserSchema = z.object({
  name: z.string().min(4, { message: 'Name must be 4 length' }),
  bio: z.string().optional().default(''),
  photo: z.string().optional(),
  avatar: z.string().optional().default(''),
  tags: z.array(z.string()).optional(),
});
export const userValidation = {
  createUserSchema,
  updateUserSchema,
};
