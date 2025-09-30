import { IUser } from '../users/user.interface';
import { generateJwtToken } from '../../utils/genrateToken';

const loginUser = async (payload: Partial<IUser>) => {
  try {
    // compare password , payload , jwt token ,

    // create payload

    const jwtPayload = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (payload as any)?._id?.toString(),

      email: payload?.email,
      name: payload?.name,
    };
   
    

    // create jwt token
    // eslint-disable-next-line no-undef
    const secretKey: string =
      process.env.BCRYPT_SECRECT_KEY || 'oidhfiudshiufhndsiuf';
    const acccesScerect: string = process.env.accessToken as string | 'access';
    const refreshScerect: string = process.env.refreshToken as
      | string
      | 'refresh';
     
      // accessToken
    const accessToken = await generateJwtToken(
      jwtPayload,
      acccesScerect,
      '15m',
    );

    // refreshToken
    const refreshToken = await generateJwtToken(
      jwtPayload,
      refreshScerect,
      '15d',
    );
    // token
    const token = await generateJwtToken(jwtPayload, secretKey, '5d');

    console.log(refreshToken ,accessToken,payload)

    const result = {
      data: payload,
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        token: token,
      },
    };

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const authServices = {
  loginUser,
};
