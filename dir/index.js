"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const app = (0, express_1.default)();
(0, logger_1.enableDebug)(true);
app.get("/", (req, res) => {
    (0, logger_1.log)("INFO", "AuthModule", "User accessed homepage");
    res.send("Hello, World!");
});
app.get("/error", (req, res) => {
    (0, logger_1.log)("ERROR", "DatabaseModule", "Database connection failed", "Error Code: 1045");
    res.status(500).send("Internal Server Error");
});
app.listen(3000, () => {
    (0, logger_1.log)("INFO", "Server", "Server started on port 3000");
    console.log("Server running on http://localhost:3000");
});
