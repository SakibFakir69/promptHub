"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myApp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// eslint-disable-next-line no-unused-vars
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./modules/users/user.route");
const auth_route_1 = require("./modules/auth/auth.route");
const app = (0, express_1.default)();
// middleware 
app.use(express_1.default.json()); /// convert to all json 
app.use(express_1.default.urlencoded({ extended: true })); // parse URL-encoded body
app.use((0, cookie_parser_1.default)()); //// enable cookies parser
// api 
app.use('/api/v1', user_route_1.userRouter);
// auth
app.use('/api/v1/auth', auth_route_1.AuthRouter);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Catch-all route for 404
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `Route not found: ${req.originalUrl}`
    });
});
exports.myApp = app;
