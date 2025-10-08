"use strict";
/* eslint-disable no-unused-vars */
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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
// jwt, cookies  , access , refressh token 
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('create user    ');
    console.log(req.body);
    try {
        const { email } = req.body;
        const isUserExits = yield user_model_1.User.findOne({ email: email });
        if (isUserExits) {
            return res.status(401).json({
                status: false,
                message: "User Already Exits",
                data: isUserExits.email
            });
        }
        const result = yield user_service_1.userServices.createUser(req.body);
        console.log(result);
        res.status(201).json({
            status: true,
            message: 'User created Successfully',
            data: result,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.userController = {
    createUser,
};
