import express, { Request, Response } from "express";
import { log, enableDebug } from "./logger";

const app = express();

enableDebug(true);

app.get("/", (req: Request, res: Response) => {
  log("INFO", "AuthModule", "User accessed homepage");
  res.send("Hello, World!");
});

app.get("/error", (req: Request, res: Response) => {
  log(
    "ERROR",
    "DatabaseModule",
    "Database connection failed",
    "Error Code: 1045"
  );
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => {
  log("INFO", "Server", "Server started on port 3000");
  console.log("Server running on http://localhost:3000");
});
