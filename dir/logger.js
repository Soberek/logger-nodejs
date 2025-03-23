"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDebug = enableDebug;
exports.setEnabledModules = setEnabledModules;
exports.log = log;
const fs_1 = __importDefault(require("fs"));
const mysql2_1 = __importDefault(require("mysql2"));
// Konfiguracja bazy danych
const db = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "loggerdb",
});
db.connect((err) => {
    if (err)
        console.error("Błąd połączenia z bazą:", err);
});
let debugMode = false;
let enabledModules = [
    "AuthModule",
    "DatabaseModule",
    "PaymentModule",
];
const logFilePath = "logs.txt";
// Funkcja do włączania/wyłączania debugowania
function enableDebug(enable) {
    debugMode = enable;
}
// Funkcja do ustawiania, z których modułów zbieramy logi
function setEnabledModules(modules) {
    enabledModules = modules;
}
// Funkcja do logowania zdarzeń
function log(level, module, message, source = "") {
    if (!debugMode && level === "DEBUG")
        return;
    if (!enabledModules.includes(module))
        return;
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    const logEntry = `[${timestamp}] [${level}] [${module}] - ${message} ${source}`;
    // Zapis do pliku
    fs_1.default.appendFile(logFilePath, logEntry + "\n", (err) => {
        if (err)
            console.error("Błąd zapisu do pliku:", err);
    });
    // Zapis do bazy danych
    const query = "INSERT INTO logs (level, module, message, source) VALUES (?, ?, ?, ?)";
    db.query(query, [level, module, message, source], (err) => {
        if (err)
            console.error("Błąd zapisu do bazy:", err);
    });
    console.log(logEntry);
}
