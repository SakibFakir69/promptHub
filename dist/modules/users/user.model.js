"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                // return true if password is valid, false if invalid
                // We want password required only if googleId is not set
                return !!this.googleId || (!!value && value.length > 0);
            },
            message: 'Password is required if Google ID is not provided',
        },
    },
    googleId: { type: String },
    photo: { type: String },
    avatar: { type: String },
    bio: { type: String, default: '' },
    gender: { type: String, default: '' },
    totalPost: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    follower: { type: [String], default: [] },
    following: { type: [String], default: [] },
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false }
}, { timestamps: true });
// Add virtual id field
userSchema.virtual("id").get(function () {
    return this._id.toString();
});
exports.User = mongoose_1.default.model('user', userSchema);
