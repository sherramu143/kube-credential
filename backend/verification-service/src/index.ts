// verification-service/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { query, initDB } from "./db.js";  // now valid

 export const app = express();
const PORT = process.env.PORT || 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.post("/verify", async (req: Request, res: Response) => {
  const { credential_id } = req.body;
  if (!credential_id) {
    return res.status(400).json({ error: "Missing credential_id" });
  }

  try {
    const result = await query(
      "SELECT * FROM credentials WHERE credential_id = $1",
      [credential_id]
    );
    const credential = result.rows[0];

    if (!credential) {
      return res
        .status(404)
        .json({ verified: false, message: "Credential not found" });
    }

    // Remove data field before sending
    const { data, ...credentialWithoutData } = credential;

    res.json({
      verified: credential.status === "issued",
      credential: credentialWithoutData,
      worker_id: WORKER_ID,
    });
  } catch (err: any) {
    console.error(`[${WORKER_ID}] DB error:`, err);
    // Check if it's a UUID validation error
    if (err.code === '22P02') {
      return res
        .status(404)
        .json({ verified: false, message: "Credential not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (_req, res) => {
  res.send(`Verification Service running on port ${PORT} (${WORKER_ID})`);
});

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await initDB(); // will create table if missing
      console.log(`✅ Postgres DB initialized for Verification Service`);

      // Start server only if not in test mode
      app.listen(PORT, () => {
        console.log(`🚀 Verification Service running on port ${PORT} (${WORKER_ID})`);
      });
    }
  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
