"use strict";
// create user
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
const ReturnResponse_1 = require("../../helper/ReturnResponse");
const user_validation_1 = require("./user.validation");
const createUser = async (req, res, next) => {
    console.log('create user    ');
    console.log(req.body);
    try {
        const { email } = req.body;
        const isUserExits = await user_model_1.User.findOne({ email: email });
        if (isUserExits) {
            return (0, ReturnResponse_1.ReturnResponse)(res, 401, false, 'User Already Exits');
        }
        const validationResult = user_validation_1.userValidation.createUserSchema.safeParse(req.body);
        if (!validationResult?.success) {
            const validationError = validationResult?.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Zod Validation Error', validationError);
        }
        const createUserData = validationResult.data;
        const result = await user_service_1.userServices.createUser(createUserData);
        console.log(result);
        (0, ReturnResponse_1.ReturnResponse)(res, 201, true, 'User created Successfully', result);
    }
    catch (error) {
        next(error);
    }
};
// delete user
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        await user_service_1.userServices.deleteUser(userId);
        (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User Deleted Successfully');
    }
    catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const user_id = req.user?.id;
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
        if (!updateDataValidation?.success) {
            const updateError = updateDataValidation?.error.format();
            return (0, ReturnResponse_1.ReturnResponse)(res, 400, false, 'Zod Update Validation Error', updateError);
        }
        const updatedData = updateDataValidation?.data;
        // update services
        const result = await user_service_1.userServices.updateUser(user_id, updatedData);
        return (0, ReturnResponse_1.ReturnResponse)(res, 200, true, 'User Data Update Successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.userController = {
    createUser,
    deleteUser,
    updateUser,
};
