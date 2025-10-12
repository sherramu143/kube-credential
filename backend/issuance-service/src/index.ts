import express, { Request, Response } from "express";
import { query, initDB } from "./db.js";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
const PORT = 4001;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

async function startServer() {
  try {
    await initDB(); // Ensure table exists
    console.log(`✅ Postgres DB initialized for Issuance Service`);

    // Issue a credential
    app.post("/issue", async (req: Request, res: Response) => {
      const { data } = req.body;

      if (!data || !data.name || !data.email || !data.course) {
        return res.status(400).json({ error: "Missing required fields: name, email, course" });
      }

      try {
        const dataStr = JSON.stringify(data);

        // Check duplicate by recipient + course
        const existingRes = await query(
          `SELECT * FROM credentials WHERE recipient = $1 AND data @> $2::jsonb`,
          [data.email, JSON.stringify({ course: data.course })]
        );
        const existing = existingRes.rows[0];

        if (existing) {
          console.log(`[${WORKER_ID}] Duplicate credential: ${existing.id}`);
          return res.json({
            message: `Credential already issued by ${existing.issuer}`,
            credential_id: existing.credential_id,
            issued_at: existing.issueDate,
            worker_id: WORKER_ID,
          });
        }

        const credential_id = uuidv4();
        const issued_at = new Date().toISOString();

        // Insert new credential
        await query(
          `INSERT INTO credentials (credential_id, name, issuer, recipient, issueDate, expiryDate, status, data)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [credential_id, data.name, "Issuance Service", data.email, issued_at, data.expiryDate || null, "issued", data]
        );

        console.log(`[${WORKER_ID}] Inserted credential: ${credential_id}`);

        res.json({
          message: "Credential issued successfully",
          credential_id,
          issued_at,
          worker_id: WORKER_ID,
        });

      } catch (err: any) {
        console.error(`[${WORKER_ID}] DB error:`, err);
        res.status(500).json({ error: err.message });
      }
    });

    // Root endpoint
    app.get("/", (_req, res) => {
      res.send(`Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });

  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
