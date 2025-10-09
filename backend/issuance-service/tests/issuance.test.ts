import request from "supertest";
import { app } from "../src/index.js";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Verification Service", () => {
  it("✅ should verify an existing credential", async () => {
    const credential_id = "existing-credential-id";

    const res = await request(app)
      .post("/verify")
      .send({ credential_id });

    assert.equal(res.status, 200);
    assert.ok(res.body.message || res.body.data, "Expected verification message");
  });

  it("❌ should return 404 for non-existing credential", async () => {
    const res = await request(app)
      .post("/verify")
      .send({ credential_id: "non-existing-id" });

    assert.equal(res.status, 404);
    assert.ok(res.body.error, "Expected an error message");
  });

  it("⚠️ should return 400 if credential_id missing", async () => {
    const res = await request(app).post("/verify").send({});

    assert.equal(res.status, 400);
    assert.ok(res.body.error, "Expected a missing credential_id error");
  });
});
