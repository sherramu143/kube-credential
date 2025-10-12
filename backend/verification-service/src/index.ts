// verification-service/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { query, initDB } from "./db.js";  // now valid

const app = express();
const PORT = process.env.PORT || 4002;
const WORKER_ID = `worker-${Math.floor(Math.random() * 1000)}`;

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

async function startServer() {
  try {
    await initDB(); // will create table if missing
    console.log(`✅ Postgres DB initialized for Verification Service`);

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

    app.get("/", (_req, res) => {
      res.send(`Verification Service running on port ${PORT} (${WORKER_ID})`);
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Verification Service running on port ${PORT} (${WORKER_ID})`);
    });

  } catch (err: any) {
    console.error("❌ DB initialization failed:", err);
    process.exit(1);
  }
}

startServer();
