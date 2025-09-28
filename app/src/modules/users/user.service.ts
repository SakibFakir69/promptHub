


// create user 

import { IUser } from "./user.interface";
import { User } from "./user.model";


const createUser =async (payload:Partial<IUser>)=>{

    const  result = await User.create(payload);

    return result;



}

export const userServices ={
    createUser
}