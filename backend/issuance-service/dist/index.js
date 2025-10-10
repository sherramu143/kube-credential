import express from "express";
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

let db;

// Initialize DB and start server after DB is ready
async function init() {
  try {
    db = await createDB();
    console.log(`✅ SQLite DB initialized for Issuance Service`);

    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Issuance Service running on port ${PORT} (${WORKER_ID})`);
    });
  } catch (err) {
    console.error("❌ DB init error:", err?.stack || err);
    process.exit(1); // exit container if DB fails
  }
}

init();

app.post("/issue", async (req, res) => {
  const { data } = req.body;
  if (!data || !data.name || !data.email || !data.course) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, email, course" });
  }

  try {
    const dataStr = JSON.stringify(data);
    const existing = await db.get(
      "SELECT * FROM credentials WHERE data = ?",
      dataStr
    );

    if (existing) {
      console.log(`[${WORKER_ID}] Duplicate credential: ${existing.credential_id}`);
      return res.json({
        message: `Credential already issued by ${existing.worker_id}`,
        credential_id: existing.credential_id,
        issued_at: existing.issued_at,
        worker_id: existing.worker_id,
      });
    }

    const credential_id = uuidv4();
    const issued_at = new Date().toISOString();
    await db.run(
      "INSERT INTO credentials (credential_id, data, issued_at, worker_id) VALUES (?, ?, ?, ?)",
      credential_id,
      dataStr,
      issued_at,
      WORKER_ID
    );

    console.log(`[${WORKER_ID}] Credential issued: ${credential_id}`);
    res.json({
      message: `Credential issued by ${WORKER_ID}`,
      credential_id,
      issued_at,
      worker_id: WORKER_ID,
    });
  } catch (err) {
    console.error(`[${WORKER_ID}] DB error:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});
