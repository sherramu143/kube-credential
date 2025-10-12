import { jest, describe, it, beforeEach, expect } from '@jest/globals';

// Mock the db module before importing anything else
const mockQuery = jest.fn() as jest.MockedFunction<any>;
jest.mock('../src/db', () => ({
  query: mockQuery,
  initDB: jest.fn(),
}));

import request from "supertest";
import { app } from "../src/index.js";

describe("Issuance Service", () => {
  const DEFAULT_CREDENTIAL_ID = "DEFAULT_CREDENTIAL_ID";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ should issue a credential with default ID", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // No existing credentials
    mockQuery.mockResolvedValueOnce({}); // Insert success

    const res = await request(app)
      .post("/issue")
      .set('Content-Type', 'application/json')
      .send({
        data: {
          name: "Test User",
          email: "test@example.com",
          course: "NodeJS Basics",
        },
        credential_id: DEFAULT_CREDENTIAL_ID,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'worked');
    expect(res.body).toHaveProperty('credentials');
    expect(Array.isArray(res.body.credentials)).toBe(true);
    expect(res.body.credentials.length).toBe(1);
    expect(res.body.credentials[0]).toHaveProperty('credential_id');
  });

  it("⚠️ should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/issue")
      .set('Content-Type', 'application/json')
      .send({ data: { name: "Test User" } });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
