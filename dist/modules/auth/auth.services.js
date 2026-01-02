"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const genrateToken_1 = require("../../utils/genrateToken");
const user_model_1 = require("../users/user.model");
const loginUser = async (payload) => {
    try {
        // compare password , payload , jwt token ,
        // create payload
        const jwtPayload = {
            id: payload?._id,
            email: payload?.email,
            name: payload?.name,
        };
        // create jwt token
        const accesScerect = process.env.BCRYPT_SECRECT_KEY;
        const refreshScerect = process.env.REFRESH_TOKEN_SECRET_KEY;
        // accessToken
        const accessToken = (0, genrateToken_1.generateJwtToken)(jwtPayload, accesScerect, '30m');
        // refreshToken
        const refreshToken = (0, genrateToken_1.generateJwtToken)(jwtPayload, refreshScerect, '15d');
        console.log(refreshToken, accessToken, payload);
        const result = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        return result;
    }
    catch (error) {
        console.log(error);
    }
};
/// password change
const passwordChange = (payload) => {
    const { newPassword, oldPassword } = payload;
    console.log(newPassword, oldPassword);
    return payload;
};
// getMe
//
const getMe = async (id) => {
    try {
        const result = await user_model_1.User.findById(id).select('-password');
        // user do not see password filed
        return result;
    }
    catch (error) {
        console.log(error);
    }
};
exports.authServices = {
    loginUser,
    passwordChange,
    getMe,
};
