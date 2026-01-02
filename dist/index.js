"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myApp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passport/passport");
const user_route_1 = require("./modules/users/user.route");
const auth_route_1 = require("./modules/auth/auth.route");
const otp_route_1 = require("./modules/otp/otp.route");
const ErrorHandler_1 = require("./helper/ErrorHandler");
const prompt_route_1 = require("./modules/prompt/prompt.route");
// app
const app = (0, express_1.default)();
// swagger ui
// Swagger Code
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API documentation for Prompt Hub',
            version: '1.0.0',
            // contact
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: "Local Server"
            }
            // online server
        ],
        // tags
    },
    apis: ['./app/src/modules/**/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// middleware 
// session middlweare
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // secure: true requires HTTPS
};
app.use((0, express_session_1.default)(sessionOptions));
// passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// express ( middleware)
app.use(express_1.default.json()); /// convert to all json 
app.use(express_1.default.urlencoded({ extended: true })); // parse URL-encoded body
app.use((0, cookie_parser_1.default)()); //// enable cookies parser
// ejs
app.set("view engine", "ejs");
// route 
app.use('/api/v1/user', user_route_1.userRouter);
// auth
app.use('/api/v1/auth', auth_route_1.AuthRouter);
// otp
app.use('/api/v1/otp', otp_route_1.otpRouter);
// prompt
app.use('/api/v1/prompt', prompt_route_1.promptRouter);
// api test
app.get('/', async (req, res) => {
    // sendEmail("sakibfakir749@gmail.com",'sakibfakir',1234);
    res.send('Hello, World!');
});
// handel error
app.use(ErrorHandler_1.ErrorHandler);
// Catch-all route for 404
app.use((req, res) => {
    res.status(404).json({
        status: false,
        message: `Route not found: ${req.originalUrl}`
    });
});
exports.myApp = app;
