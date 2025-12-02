"use strict";
// create user
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
const ReturnResponse_1 = require("../../helper/ReturnResponse");
const user_validation_1 = require("./user.validation");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('create user    ');
    console.log(req.body);
    try {
        const { email } = req.body;
        const isUserExits = yield user_model_1.User.findOne({ email: email });
        if (isUserExits) {
            return (0, ReturnResponse_1.ReturnResponse)(res, 401, false, 'User Already Exits');
        }
        const validationResult = user_validation_1.userValidation.createUserSchema.safeParse(req.body);
        if (!(validationResult === null || validationResult === void 0 ? void 0 : validationResult.success)) {
            const validationError = validationResult === null || validationResult === void 0 ? void 0 : validationResult.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Zod Validation Error', validationError);
        }
        const createUserData = validationResult.data;
        const result = yield user_service_1.userServices.createUser(createUserData);
        console.log(result);
        (0, ReturnResponse_1.ReturnResponse)(res, 201, true, 'User created Successfully', result);
    }
    catch (error) {
        next(error);
    }
});
// delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield user_service_1.userServices.deleteUser(userId);
        (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User Deleted Successfully');
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updateData = {
            name: req.body.name,
            bio: req.body.bio,
            photo: req.body.photo,
            avatar: req.body.avatar,
            tags: req.body.tags,
            // extend as need
        };
        // zod validation
        const updateDataValidation = user_validation_1.userValidation.updateUserSchema.safeParse(updateData);
        if (!(updateDataValidation === null || updateDataValidation === void 0 ? void 0 : updateDataValidation.success)) {
            const updateError = updateDataValidation === null || updateDataValidation === void 0 ? void 0 : updateDataValidation.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Zod Update Validation Error', updateError);
        }
        const updatedData = updateDataValidation === null || updateDataValidation === void 0 ? void 0 : updateDataValidation.data;
        // update services
        const result = yield user_service_1.userServices.updateUser(user_id, updatedData);
        return (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User Data Update Successfully', result);
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    createUser,
    deleteUser,
    updateUser,
};
