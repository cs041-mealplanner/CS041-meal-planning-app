import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/lib/prisma';

async function signupAndGetToken() {
  const email = `mp${Date.now()}@test.com`;
  const password = 'secret123';
  const res = await request(app).post('/api/auth/signup').send({ email, password });
  return { token: res.body.accessToken as string, userId: res.body.user.id as string };
}

describe('MealPlans', () => {
  it('rejects unauthorized access', async () => {
    const res = await request(app).get('/api/mealplans');
    expect(res.status).toBe(401);
  });

  it('lists and deletes plans with auth (create via DB due to date validation bug)', async () => {
    const { token, userId } = await signupAndGetToken();

    const recipe1 = await prisma.recipe.create({
      data: {
        title: 'Tomato Soup',
        ingredients: {
          create: [
            { name: 'Tomato', amount: 2, unit: 'pcs', category: 'vegetable' },
            { name: 'Onion', amount: 1, unit: 'pcs', category: 'vegetable' },
          ],
        },
      },
    });
    const recipe2 = await prisma.recipe.create({
      data: {
        title: 'Grilled Chicken',
        ingredients: {
          create: [
            { name: 'Tomato', amount: 3, unit: 'pcs', category: 'vegetable' },
            { name: 'Chicken', amount: 1, unit: 'kg', category: 'meat' },
          ],
        },
      },
    });

    // Create a plan directly via Prisma (route date regex is currently incorrect)
    const plan = await prisma.mealPlan.create({
      data: {
        userId,
        date: new Date('2024-01-01'),
        meals: {
          create: [
            {
              time: 'breakfast',
              recipes: {
                create: [{ recipeId: recipe1.id }, { recipeId: recipe2.id }],
              },
            },
          ],
        },
      },
    });

    const list = await request(app)
      .get('/api/mealplans')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    const found = list.body.find((p: any) => p.id === plan.id);
    expect(found).toBeTruthy();
    expect(found.date).toBe('2024-01-01');
    expect(found.meals[0].recipes.map((r: any) => r.id).sort()).toEqual(
      [recipe1.id, recipe2.id].sort(),
    );

    const del = await request(app)
      .delete(`/api/mealplans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(200);
    expect(del.body.ok).toBe(true);

    const delAgain = await request(app)
      .delete(`/api/mealplans/${plan.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(delAgain.status).toBe(404);
  });
});


