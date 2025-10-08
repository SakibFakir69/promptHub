"use strict";
// login-user
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const user_model_1 = require("../users/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_services_1 = require("./auth.services");
// add to cookies ,
// verify token store req.body = req.user
// login , and logout test
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('login user');
        const { email, password } = req.body;
        const isUserExits = yield user_model_1.User.findOne({ email: email });
        console.log(email, password);
        // find user
        if (!isUserExits) {
            return res.status(401).json({
                status: false,
                message: 'User not founded',
                data: null,
            });
        }
        // compare password
        const hashPassword = isUserExits.password;
        const isMatchPassword = yield bcryptjs_1.default.compare(password, hashPassword);
        if (!isMatchPassword) {
            return res.status(404).json({
                status: false,
                message: 'Invalid credentials',
                data: null,
            });
        }
        // cdata
        const result = yield auth_services_1.authServices.loginUser(isUserExits);
        const accessToken = result === null || result === void 0 ? void 0 : result.accessToken;
        const refreshToken = result === null || result === void 0 ? void 0 : result.refreshToken;
        if (!accessToken || !refreshToken) {
            return res
                .status(500)
                .json({ status: false, message: 'Token generation failed' });
        }
        console.log(accessToken, refreshToken, ' token ');
        // setcookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        // refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 60 * 1000,
        });
        console.log("cookies set");
        return res.status(200).json({
            message: "User Login Successfully",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
    catch (error) {
        console.log(error);
    }
});
// password change
const passwordChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userPassword = req === null || req === void 0 ? void 0 : req.user;
        const passwordDetails = {
            newPassword: password,
        };
        const result = yield auth_services_1.authServices.passwordChange(passwordDetails);
        return res.status(200).json({
            status: true,
            message: "password-change",
            data: result,
            pass: userPassword
        });
    }
    catch (error) {
        console.log(error);
    }
});
// export
exports.authController = {
    loginUser, passwordChange
};
