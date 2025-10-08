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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// create user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!payload) {
            throw new Error('Payload not founded');
        }
        const password = payload.password;
        // eslint-disable-next-line no-undef, no-unused-vars
        const saltRound = Number(process.env.SALT) || 10;
        //   hashPassword
        const hashPassword = yield bcryptjs_1.default.hash(password, saltRound);
        payload.password = hashPassword;
        const result = yield user_model_1.User.create(payload);
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.userServices = {
    createUser,
};
