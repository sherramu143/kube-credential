import express, { Request, Response } from "express";
import { createDB } from "./db.js";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const PORT = 4001;
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

// ✅ Initialize DB before setting up routes
async function startServer() {
  try {
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
        const dataStr = JSON.stringify(data);

        // ✅ Check for duplicate
        const existing = await db.get(
          "SELECT * FROM credentials WHERE data = ?",
          dataStr
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

        // Insert into DB
        await db.run(
          `INSERT INTO credentials (credential_id, name, issuer, recipient, issueDate, expiryDate, status, data)
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

        // Immediately fetch the inserted row for logging
        const insertedRow = await db.get(
          "SELECT * FROM credentials WHERE credential_id = ?",
          credential_id
        );
        console.log(`[${WORKER_ID}] Inserted credential in DB:`, insertedRow);

        // Respond to client
        res.json({
          message: "Credential issued successfully",
          credential_id,
          issued_at,
          worker_id: WORKER_ID,
          insertedRow, // optional: return full DB row to Postman
        });
      } catch (err: any) {
        console.error(`[${WORKER_ID}] DB error:`, err);
        res.status(500).json({ error: err.message });
      }
    });

    // Root endpoint
    app.get("/", (req: Request, res: Response) => {
      res.send(`Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });
  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
