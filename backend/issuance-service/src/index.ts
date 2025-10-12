import express, { Request, Response } from "express";
import { query, initDB } from "./db.js";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

// Assign a unique worker ID (can also use process.env.POD_NAME in Kubernetes)
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

const app = express();
const PORT = 4001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/issue", async (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data || !data.name || !data.email || !data.course) {
    return res.status(400).json({
      error: "Missing required fields: name, email, course",
    });
  }

  try {
    // Check if a credential already exists for this user and course
    const existingRes = await query(
      `SELECT * FROM credentials WHERE recipient = $1 AND data @> $2::jsonb`,
      [data.email, JSON.stringify({ course: data.course })]
    );

    const existing = existingRes.rows[0];

    if (existing) {
      return res.json({
        message: `Credential already issued by ${WORKER_ID}`,
        credential_id: existing.credential_id,
        issued_at: existing.issueDate,
        worker_id: WORKER_ID,
      });
    }

    // Issue new credential
    const credential_id = uuidv4();
    const issued_at = new Date().toISOString();

    await query(
      `INSERT INTO credentials (credential_id, name, issuer, recipient, issueDate, expiryDate, status, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        credential_id,
        data.name,
        "Issuance Service",
        data.email,
        issued_at,
        data.expiryDate || null,
        "issued",
        data,
      ]
    );

    res.json({
      message: `Credential issued by ${WORKER_ID}`,
      credential_id,
      issued_at,
      worker_id: WORKER_ID,
    });
  } catch (err: any) {
    console.error(`[${WORKER_ID}] DB error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Optional: root endpoint
app.get("/", (_req, res) => {
  res.send(`Issuance Service running on port ${PORT} (${WORKER_ID})`);
});

async function startServer() {
  try {
    await initDB();
    console.log("✅ DB initialized");

    app.listen(PORT, () => {
      console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });
  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
