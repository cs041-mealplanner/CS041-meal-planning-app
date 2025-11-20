// src/app.js
// Express app (no server listening)
// -------------------------------
// We keep the core Express app separate from app.listen()
// so Supertest can import the app directly during tests
// without starting a real HTTP server.

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
