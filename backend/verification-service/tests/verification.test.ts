import request from 'supertest';
import { app } from '../src/index';
import { describe, it } from 'node:test';

describe('Verification Service', () => {
  it('should verify an existing credential', async () => {
    const credential_id = 'existing-credential-id';
    const res = await request(app).post('/verify').send({ credential_id });

    expect(res.status);
    expect(res.body.message);
    expect(res.body);
  });

  it('should return 404 for non-existing credential', async () => {
    const res = await request(app)
      .post('/verify')
      .send({ credential_id: 'non-existing-id' });

    expect(res.status);
    expect(res.body.error);
  });

  it('should return 400 if credential_id missing', async () => {
    const res = await request(app).post('/verify').send({});
    expect(res.status);
    expect(res.body.error);
  });
});
function expect(status: number) {
    throw new Error('Function not implemented.');
}

