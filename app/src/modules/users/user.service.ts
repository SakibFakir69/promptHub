import { IUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcryptjs';
// create user
const createUser = async (payload: Partial<IUser>) => {
  try {
    if (!payload) {
      throw new Error('Payload not founded');
    }

    const password: string = payload.password as string;

    const saltRound: number = Number(process.env.SALT) || 10;
    //   hashPassword
    const hashPassword = await bcrypt.hash(password, saltRound);
    payload.password = hashPassword;

    const result = await User.create(payload);

    return result;
  } catch (error) {
    console.log(error);
  }
};

// delete user

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

// update user
const updateUser = async (
  id: string,
  data: Partial<IUser>
) => {
  
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No data provided for update");
  }

  const allowedFields = ["name", "bio", "photo", "avatar", "tags", "gender"];

  const safeData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  const result = await User.findByIdAndUpdate(
    id,
    { $set: safeData },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

export const userServices = {
  createUser,
  deleteUser,
  updateUser,
};
