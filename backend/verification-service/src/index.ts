import express, { Request, Response } from "express";
import { createDB } from "./db.js";
import cors from "cors";
const app = express();
const PORT = 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
// Instead of:
// app.use(require("cors")({ ... }));

// Use ES module import:


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

        // Simple verification logic
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
