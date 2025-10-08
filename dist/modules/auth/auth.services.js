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
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // compare password , payload , jwt token ,
        // create payload
        const jwtPayload = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: (_a = payload === null || payload === void 0 ? void 0 : payload._id) === null || _a === void 0 ? void 0 : _a.toString(),
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            name: payload === null || payload === void 0 ? void 0 : payload.name,
        };
        // create jwt token
        // eslint-disable-next-line no-undef
        const accesScerect = process.env.BCRYPT_SECRECT_KEY;
        const refreshScerect = process.env.BCRYPT_SECRECT_KEY;
        // accessToken
        const accessToken = yield (0, genrateToken_1.generateJwtToken)(jwtPayload, accesScerect, '15d');
        // refreshToken
        const refreshToken = yield (0, genrateToken_1.generateJwtToken)(jwtPayload, refreshScerect, '15d');
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
    return payload;
};
exports.authServices = {
    loginUser, passwordChange
};
