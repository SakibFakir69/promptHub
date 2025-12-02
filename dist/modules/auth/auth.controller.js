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
const SetCookies_1 = __importDefault(require("../../utils/SetCookies"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genrateToken_1 = require("../../utils/genrateToken");
const ReturnResponse_1 = require("../../helper/ReturnResponse");
const auth_validation_1 = require("./auth.validation");
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('login user');
        const { email, password } = req.body;
        const zodValidation = auth_validation_1.authValidator.loginUserValidationSchema.safeParse(req.body);
        if (!zodValidation.success) {
            const errors = zodValidation === null || zodValidation === void 0 ? void 0 : zodValidation.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Validation failed', errors);
        }
        const isUserExits = yield user_model_1.User.findOne({ email: email });
        console.log(email, password);
        // find user
        if (!isUserExits) {
            (0, ReturnResponse_1.ReturnResponse)(res, 401, false, 'User not founded');
            return;
        }
        // compare password
        const hashPassword = isUserExits === null || isUserExits === void 0 ? void 0 : isUserExits.password;
        const isMatchPassword = yield bcryptjs_1.default.compare(password, hashPassword);
        if (!isMatchPassword) {
            (0, ReturnResponse_1.ReturnResponse)(res, 404, false, 'Invalid credentials');
            return;
        }
        // cdata
        const result = yield auth_services_1.authServices.loginUser(isUserExits);
        const accessToken = result === null || result === void 0 ? void 0 : result.accessToken;
        const refreshToken = result === null || result === void 0 ? void 0 : result.refreshToken;
        if (!accessToken || !refreshToken) {
            (0, ReturnResponse_1.ReturnResponse)(res, 500, false, 'Token generation failed');
            return;
        }
        console.log(accessToken, refreshToken, ' token ');
        // setcookies
        /// access token
        (0, SetCookies_1.default)(res, 'accessToken', accessToken, 24 * 60 * 60 * 1000);
        // refresh token
        (0, SetCookies_1.default)(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000);
        console.log('cookies set');
        return res.status(200).json({
            message: 'User Login Successfully',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
// password change
const ResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { newPassword } = req.body;
        // zod validation 
        const zodValidation = auth_validation_1.authValidator.resetPasswordSchema.safeParse(req.body);
        if (!(zodValidation === null || zodValidation === void 0 ? void 0 : zodValidation.success)) {
            const errors = zodValidation.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Validation failed', errors);
        }
        // old and new pass take then verify
        const email = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log(email);
        const isUser = yield user_model_1.User.findOne({ email: email });
        //
        if (!isUser) {
            (0, ReturnResponse_1.ReturnResponse)(res, 404, false, 'User not found');
            return;
        }
        const hashNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        isUser.password = hashNewPassword;
        yield (isUser === null || isUser === void 0 ? void 0 : isUser.save());
        return (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'password reset successfully');
    }
    catch (error) {
        next(error);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, newPassword } = req.body;
        // zod validation 
        const zodValidation = auth_validation_1.authValidator.changePasswordSchema.safeParse(req.body);
        if (!(zodValidation === null || zodValidation === void 0 ? void 0 : zodValidation.success)) {
            const errors = zodValidation === null || zodValidation === void 0 ? void 0 : zodValidation.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, "Validation Failed", errors);
        }
        // old and new pass take then verify
        const email = req === null || req === void 0 ? void 0 : req.user;
        const isUser = yield user_model_1.User.findOne({ email: email });
        //
        if (!isUser) {
            (0, ReturnResponse_1.ReturnResponse)(res, 404, false, 'User not found');
            return;
        }
        const isMatchPassword = yield bcryptjs_1.default.compare(password, isUser.password);
        if (!isMatchPassword) {
            (0, ReturnResponse_1.ReturnResponse)(res, 200, false, 'Password not match');
            return;
        }
        const hashNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        isUser.password = hashNewPassword;
        yield (isUser === null || isUser === void 0 ? void 0 : isUser.save());
        (0, ReturnResponse_1.ReturnResponse)(res, 200, false, 'password change successfully');
        return;
    }
    catch (error) {
        next(error);
    }
});
// logout user
const logOutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield user_model_1.User.findById(user_id);
        if (!user) {
            ;
            (0, ReturnResponse_1.ReturnResponse)(res, 404, false, 'User Not Founded');
            return;
        }
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        });
        (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User Log Out Successfully');
    }
    catch (error) {
        next(error);
    }
});
// get me
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!user_id) {
            (0, ReturnResponse_1.ReturnResponse)(res, 404, false, 'User not founded');
            return;
        }
        const users = yield auth_services_1.authServices.getMe(user_id);
        (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User login successfull', users);
         
    }
    catch (error) {
        next(error);
    }
});
// refresh token
const refreshToken = (req, res, next) => {
    var _a;
    try {
        const refresh_token = req.cookies.refreshToken;
        //// verify refreshToken
        if (!refresh_token) {
            (0, ReturnResponse_1.ReturnResponse)(res, 401, false, 'Token expired');
            return;
        }
        const refresh_secrect = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.REFRESH_TOKEN_SECRET_KEY) || 'token';
        jsonwebtoken_1.default.verify(refresh_token, refresh_secrect, (error) => {
            if (error) {
                (0, ReturnResponse_1.ReturnResponse)(res, 403, false, 'You are not allowed to perform this action');
                return;
            }
            const user = req.user;
            const jwtPayload = {
                id: user === null || user === void 0 ? void 0 : user._id,
                email: user === null || user === void 0 ? void 0 : user.email,
                name: user === null || user === void 0 ? void 0 : user.name,
            };
            const accesScerect = process.env.BCRYPT_SECRECT_KEY;
            const accessToken = (0, genrateToken_1.generateJwtToken)(jwtPayload, accesScerect, '30m');
            return res.status(201).json({
                accessToken: accessToken
            });
        });
    }
    catch (error) {
        next(error);
    }
};
// export
exports.authController = {
    loginUser,
    ResetPassword,
    changePassword,
    getMe,
    logOutUser,
    refreshToken
};
