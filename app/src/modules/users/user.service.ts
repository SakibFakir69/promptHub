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

    // eslint-disable-next-line no-undef, no-unused-vars
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

const deleteUser = async (id:string)=>{

  const result = await User.findByIdAndUpdate(id, {
    isDelete:false,

  },{upsert:true});
  return result;

}

export const userServices = {
  createUser,deleteUser
};
