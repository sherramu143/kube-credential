import express, { Request, Response } from "express";
import { createDB } from "./db.js";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

let db: any;

async function startServer() {
  try {
    db = await createDB();
    console.log(`✅ SQLite DB initialized for Verification Service`);

    // -------------------------------
    // 🚀 Routes
    // -------------------------------

    // Verify a credential
    app.post("/verify", async (req: Request, res: Response) => {
      const { credential_id } = req.body;

      if (!credential_id) {
        return res.status(400).json({ error: "Missing credential_id" });
      }

      try {
        const credential = await db.get(
          "SELECT * FROM credentials WHERE credential_id = ?",
          credential_id
        );

        if (!credential) {
          return res.status(404).json({ verified: false, message: "Credential not found" });
        }

        res.json({
          verified: credential.status === "issued",
          credential,
          worker_id: WORKER_ID,
        });
      } catch (err: any) {
        console.error(`[${WORKER_ID}] DB error:`, err);
        res.status(500).json({ error: err.message });
      }
    });

    // Temporary debug endpoint to inspect DB contents
    app.get("/debug/db", async (req: Request, res: Response) => {
      try {
        // Open the same DB file in read-only mode
        const debugDb = await open({ filename: db.filename, driver: sqlite3.Database });

        // List all tables
        const tables = await debugDb.all("SELECT name FROM sqlite_master WHERE type='table'");
        let credentials: any[] = [];

        if (tables.some(t => t.name === "credentials")) {
          credentials = await debugDb.all("SELECT * FROM credentials");
        }

        await debugDb.close();

        console.log(`[${WORKER_ID}] /debug/db called - Tables:`, tables);
        console.log(`[${WORKER_ID}] /debug/db called - Credentials:`, credentials);

        res.json({
          tables,
          credentials,
        });
      } catch (err: any) {
        console.error(`[${WORKER_ID}] Error reading DB:`, err.message);
        res.status(500).json({ error: err.message });
      }
    });

    // Root endpoint
    app.get("/", (req: Request, res: Response) => {
      res.send(`Verification Service running on port ${PORT} (${WORKER_ID})`);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Verification Service running on port ${PORT} (${WORKER_ID})`);
    });
  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
