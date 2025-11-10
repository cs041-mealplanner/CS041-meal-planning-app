import request from 'supertest';
import app from '../src/index';

async function signupAndGetToken() {
  const email = `ing${Date.now()}@test.com`;
  const password = 'secret123';
  const res = await request(app).post('/api/auth/signup').send({ email, password });
  return res.body.accessToken as string;
}

describe('Ingredients', () => {
  it('rejects unauthorized access', async () => {
    const res = await request(app).get('/api/ingredients');
    expect(res.status).toBe(401);
  });

  it('allows CRUD with auth', async () => {
    const token = await signupAndGetToken();
    const create = await request(app)
      .post('/api/ingredients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tomato', category: 'vegetable', amount: 2 });
    expect(create.status).toBe(201);

    const list = await request(app).get('/api/ingredients').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});


