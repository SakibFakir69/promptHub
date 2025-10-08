"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwtToken = (payload, secret, expiresIn) => {
    if (!secret)
        throw new Error("JWT secret is missing");
    if (!expiresIn)
        throw new Error("JWT expiresIn is missing");
    if (!payload)
        throw new Error("JWT payload missing");
    const options = {
        expiresIn: "30d",
        algorithm: "HS256"
    };
    // synchronous call
    const result = jsonwebtoken_1.default.sign(payload, secret, options);
    return result;
};
exports.generateJwtToken = generateJwtToken;
