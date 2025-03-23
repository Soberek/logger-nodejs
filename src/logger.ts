import fs from "fs";
import mysql from "mysql2";

// Typy dla poziomów logowania
type LogLevel = "INFO" | "DEBUG" | "ERROR";

// Konfiguracja bazy danych
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loggerdb",
});

db.connect((err) => {
  if (err) console.error("Błąd połączenia z bazą:", err);
});

let debugMode = false;
let enabledModules: string[] = [
  "AuthModule",
  "DatabaseModule",
  "PaymentModule",
];
const logFilePath = "logs.txt";

// Funkcja do włączania/wyłączania debugowania
export function enableDebug(enable: boolean): void {
  debugMode = enable;
}

// Funkcja do ustawiania, z których modułów zbieramy logi
export function setEnabledModules(modules: string[]): void {
  enabledModules = modules;
}

// Funkcja do logowania zdarzeń
export function log(
  level: LogLevel,
  module: string,
  message: string,
  source: string = ""
): void {
  if (!debugMode && level === "DEBUG") return;
  if (!enabledModules.includes(module)) return;

  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const logEntry = `[${timestamp}] [${level}] [${module}] - ${message} ${source}`;

  // Zapis do pliku
  fs.appendFile(logFilePath, logEntry + "\n", (err) => {
    if (err) console.error("Błąd zapisu do pliku:", err);
  });

  // Zapis do bazy danych
  const query =
    "INSERT INTO logs (level, module, message, source) VALUES (?, ?, ?, ?)";
  db.query(query, [level, module, message, source], (err) => {
    if (err) console.error("Błąd zapisu do bazy:", err);
  });

  console.log(logEntry);
}
