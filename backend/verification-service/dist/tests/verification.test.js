import { jest } from '@jest/globals';
// Mock the db module before importing anything else
const mockQuery = jest.fn();
jest.mock('../src/db.js', () => ({
    query: mockQuery,
    initDB: jest.fn(),
}));
import request from 'supertest';
import { app } from '../src/index.js';
describe('Verification Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should verify an existing credential', async () => {
        const credential_id = '40a39342-b162-42aa-aa0b-0eaf1e0e9c44';
        mockQuery.mockResolvedValue({
            rows: [{
                    id: 1,
                    credential_id,
                    name: 'Test Credential',
                    issuer: 'Test Issuer',
                    recipient: 'Test Recipient',
                    issueDate: '2023-01-01',
                    expiryDate: '2024-01-01',
                    status: 'issued',
                    data: '{}'
                }],
            command: '',
            rowCount: 1,
            oid: 0,
            fields: []
        });
        const res = await request(app).post('/verify').send({ credential_id });
        expect(res.status).toBe(200);
        expect(res.body.verified).toBe(true);
        expect(res.body.credential.credential_id).toBe(credential_id);
    });
    it('should return 404 for non-existing credential', async () => {
        mockQuery.mockResolvedValue({
            rows: [],
            command: '',
            rowCount: 0,
            oid: 0,
            fields: []
        });
        const res = await request(app)
            .post('/verify')
            .send({ credential_id: 'non-existing-id' });
        expect(res.status).toBe(404);
        expect(res.body.verified).toBe(false);
        expect(res.body.message).toBe('Credential not found');
    });
    it('should return 400 if credential_id missing', async () => {
        const res = await request(app).post('/verify').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing credential_id');
    });
});
