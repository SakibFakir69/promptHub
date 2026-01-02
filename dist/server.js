"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
// import from server
const port = Number(process.env.PORT) || 5000;
const URI = process.env.DATABASE_URL;
let server;
// port
console.log(URI);
(async function () {
    if (!URI) {
        throw new Error('Not found Database Url');
    }
    try {
        await mongoose_1.default.connect(URI);
        server = _1.myApp.listen(port, () => {
            console.log(`server running on this port ${port}`);
        });
        console.log(server);
    }
    catch (error) {
        console.log(error);
    }
})();
_1.myApp.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
