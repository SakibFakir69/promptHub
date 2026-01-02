"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// create user
const createUser = async (payload) => {
    try {
        if (!payload) {
            throw new Error('Payload not founded');
        }
        const password = payload.password;
        const saltRound = Number(process.env.SALT) || 10;
        //   hashPassword
        const hashPassword = await bcryptjs_1.default.hash(password, saltRound);
        payload.password = hashPassword;
        const result = await user_model_1.User.create(payload);
        return result;
    }
    catch (error) {
        console.log(error);
    }
};
// delete user
const deleteUser = async (id) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, {
        isDelete: false,
    }, { upsert: true });
    return result;
};
// update user
const updateUser = async (id, data) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, { $set: data }, {
        new: true, /// return new data
        runValidators: true, /// return mongos validator
    });
    return result;
};
exports.userServices = {
    createUser,
    deleteUser,
    updateUser,
};
