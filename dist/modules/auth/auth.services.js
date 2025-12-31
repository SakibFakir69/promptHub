"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const genrateToken_1 = require("../../utils/genrateToken");
const user_model_1 = require("../users/user.model");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // compare password , payload , jwt token ,
        // create payload
        const jwtPayload = {
            id: payload === null || payload === void 0 ? void 0 : payload._id,
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            name: payload === null || payload === void 0 ? void 0 : payload.name,
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
});
/// password change
const passwordChange = (payload) => {
    const { newPassword, oldPassword } = payload;
    console.log(newPassword, oldPassword);
    return payload;
};
// getMe
//
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.User.findById(id).select('-password');
        // user do not see password filed
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.authServices = {
    loginUser,
    passwordChange,
    getMe,
};
