import request from 'supertest';
import app from '../src/index';

describe('Auth', () => {
  const email = `user${Date.now()}@test.com`;
  const password = 'secret123';

  it('signs up a new user and returns access token', async () => {
    const res = await request(app).post('/api/auth/signup').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('logs in with the same user and returns access token', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
    expect(typeof res.body.accessToken).toBe('string');
  });
});


