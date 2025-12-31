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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.verifyToken = verifyToken;
