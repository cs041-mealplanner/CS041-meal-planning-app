import request from 'supertest';
import app from '../src/index';

async function signupAndGetToken() {
  const email = `rcp${Date.now()}@test.com`;
  const password = 'secret123';
  const res = await request(app).post('/api/auth/signup').send({ email, password });
  return res.body.accessToken as string;
}

describe('Recipes', () => {
  it('rejects unauthorized access', async () => {
    const res = await request(app).get('/api/recipes/search');
    expect(res.status).toBe(401);
  });

  it('search returns a results array with auth', async () => {
    const token = await signupAndGetToken();
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ category: 'breakfast', keyword: 'chicken' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });
});


