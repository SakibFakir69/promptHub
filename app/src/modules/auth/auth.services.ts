/* eslint-disable no-undef */
import { IUser } from '../users/user.interface';
import { generateJwtToken } from '../../utils/genrateToken';



interface IPasswordPayload {
  newPassword?:string,
  oldPassword?:string
}


const loginUser = async (payload:Partial<IUser>) => {
  try {
    // compare password , payload , jwt token ,

    // create payload

    const jwtPayload = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id:payload?._id , 

      email: payload?.email,
      name: payload?.name,
    };
   
    

    // create jwt token
    // eslint-disable-next-line no-undef
    
    const accesScerect: string = process.env.BCRYPT_SECRECT_KEY as string | 'token';
    const refreshScerect: string = process.env.BCRYPT_SECRECT_KEY as
      | string
      | 'token';
     
      // accessToken
    const accessToken = await generateJwtToken(
      jwtPayload,
      accesScerect,
      '15d',
    );

    // refreshToken
    const refreshToken = await generateJwtToken(
      jwtPayload,
      refreshScerect,
      '15d',
    );
    
    console.log(refreshToken ,accessToken,payload)

    const result = {
    
    
        accessToken: accessToken,
        refreshToken: refreshToken,
     
    };

    return result;
  } catch (error) {
    console.log(error);
  }
};



/// password change 


const passwordChange = (payload: IPasswordPayload )=>{

 
  const {newPassword,oldPassword} = payload;
  console.log(newPassword, oldPassword)



  return payload;

}


// getMe 

// const getMe = ()=>{

//   try {
    
//   } catch (error) {
    
//   }


// }

export const authServices = {
  loginUser,passwordChange
};
