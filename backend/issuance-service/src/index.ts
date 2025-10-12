// issuance-service/src/index.ts
import express, { Request, Response } from "express";
import { createDB } from "./db.js";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4001;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

let db: any;

async function startServer() {
  try {
    // Initialize DB
    db = await createDB();
    console.log(`✅ SQLite DB initialized for Issuance Service`);

    // -------------------------------
    // 🚀 Routes
    // -------------------------------

    // Issue a credential
    app.post("/issue", async (req: Request, res: Response) => {
      const { data } = req.body;

      if (!data || !data.name || !data.email || !data.course) {
        return res
          .status(400)
          .json({ error: "Missing required fields: name, email, course" });
      }

      try {
        // Safer duplicate check: email + course
        const existing = await db.get(
          "SELECT * FROM credentials WHERE recipient = ? AND data LIKE ?",
          data.email,
          `%${data.course}%`
        );

        if (existing) {
          console.log(`[${WORKER_ID}] Duplicate credential: ${existing.id}`);
          return res.json({
            message: `Credential already issued by ${existing.issuer}`,
            credential_id: existing.credential_id || existing.id,
            issued_at: existing.issueDate,
            worker_id: WORKER_ID,
          });
        }

        const credential_id = uuidv4();
        const issued_at = new Date().toISOString();
        const dataStr = JSON.stringify(data);

        // Insert credential
        await db.run(
          `INSERT INTO credentials 
          (credential_id, name, issuer, recipient, issueDate, expiryDate, status, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          credential_id,
          data.name,
          "Issuance Service",
          data.email,
          issued_at,
          data.expiryDate || null,
          "issued",
          dataStr
        );

        const insertedRow = await db.get(
          "SELECT * FROM credentials WHERE credential_id = ?",
          credential_id
        );

        console.log(`[${WORKER_ID}] Inserted credential in DB:`, insertedRow);

        res.json({
          message: "Credential issued successfully",
          credential_id,
          issued_at,
          worker_id: WORKER_ID,
          insertedRow, // optional for debugging
        });
      } catch (err: any) {
        console.error(`[${WORKER_ID}] DB error:`, err);
        res.status(500).json({ error: err.message });
      }
    });

    // Debug route to inspect DB contents
    app.get("/debug/db", async (_req: Request, res: Response) => {
      try {
        const rows = await db.all("SELECT * FROM credentials");
        res.json(rows);
      } catch (err: any) {
        console.error(`[${WORKER_ID}] DB debug error:`, err.message);
        res.status(500).json({ error: err.message });
      }
    });

    // Root endpoint
    app.get("/", (_req: Request, res: Response) => {
      res.send(`Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });
  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
