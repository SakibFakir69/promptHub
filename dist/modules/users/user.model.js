"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    gender: { type: String, default: '' },
    totalPost: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    follower: { type: [String], default: [] },
    following: { type: [String], default: [] },
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false }
}, { timestamps: true });
exports.User = mongoose_1.default.model('user', userSchema);
