import { IUser } from '../users/user.interface';
import { generateJwtToken } from '../../utils/genrateToken';
import { User } from '../users/user.model';
// import { authValidator } from './auth.validation';

interface IPasswordPayload {
  newPassword?: string;
  oldPassword?: string;
}
interface IJwtPayload {
  _id: string;
  name: string;
  email: string;
}

const loginUser = async (payload: Partial<IJwtPayload>) => {
  try {
    // compare password , payload , jwt token ,

    // create payload

    const jwtPayload = {
      id: payload?._id,

      email: payload?.email,
      name: payload?.name,
    };

    // create jwt token

    const accesScerect: string = process.env.BCRYPT_SECRECT_KEY as
      | string
      | 'token';
    const refreshScerect: string = process.env.REFRESH_TOKEN_SECRET_KEY as
      | string
      | 'token';

    // accessToken
    const accessToken = generateJwtToken(jwtPayload, accesScerect, '30m');

    // refreshToken
    const refreshToken = generateJwtToken(jwtPayload, refreshScerect, '15d');

    console.log(refreshToken, accessToken, payload);

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

const passwordChange = (payload: IPasswordPayload) => {
  const { newPassword, oldPassword } = payload;
  console.log(newPassword, oldPassword);

  return payload;
};

// getMe
//
const getMe = async (id: string) => {
  try {
    const result = await User.findById(id).select('-password');
    // user do not see password filed

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const authServices = {
  loginUser,
  passwordChange,
  getMe,
};
