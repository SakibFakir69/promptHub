"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log(req.cookies, 'cookies');
    console.log(' ', token);
    // tokn 401
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    const SECRECT_KEY = process.env.BCRYPT_SECRECT_KEY;
    console.log(token);
    console.log('=============================');
    console.log(SECRECT_KEY);
    jsonwebtoken_1.default.verify(token, SECRECT_KEY, (err, decode) => {
        console.log('verify');
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ status: false, message: "Token expired" });
            }
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }
        req.user = decode;
        console.log(req.user, " decode");
        next();
    });
};
exports.verifyToken = verifyToken;
