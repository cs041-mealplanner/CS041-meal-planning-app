import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/errors';

export type MealInput = { time: string; recipes: string[] };
export type CreateMealPlanInput = { date: string; meals: MealInput[] };

export async function createMealPlan(userId: string, input: CreateMealPlanInput) {
  const date = new Date(input.date);
  return prisma.mealPlan.create({
    data: {
      userId,
      date,
      meals: {
        create: input.meals.map((m) => ({
          time: m.time,
          recipes: {
            create: m.recipes.map((recipeId) => ({ recipeId })),
          },
        })),
      },
    },
    include: {
      meals: { include: { recipes: { include: { recipe: { select: { id: true, title: true } } } } } },
    },
  });
}

export async function listMealPlans(userId: string) {
  const rows = await prisma.mealPlan.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
    include: {
      meals: {
        orderBy: { time: 'asc' },
        include: { recipes: { include: { recipe: { select: { id: true, title: true } } } } },
      },
    },
  });
  return rows;
}

export async function updateMealPlan(userId: string, id: string, input: CreateMealPlanInput) {
  const plan = await prisma.mealPlan.findFirst({ where: { id, userId } });
  if (!plan) throw new NotFoundError('Meal plan not found');
  const date = new Date(input.date);
  await prisma.$transaction(async (tx) => {
    await tx.meal.deleteMany({ where: { mealPlanId: id } });
    await tx.mealPlan.update({
      where: { id },
      data: {
        date,
        meals: {
          create: input.meals.map((m) => ({
            time: m.time,
            recipes: { create: m.recipes.map((recipeId) => ({ recipeId })) },
          })),
        },
      },
    });
  });
  return prisma.mealPlan.findFirst({
    where: { id, userId },
    include: {
      meals: { include: { recipes: { include: { recipe: { select: { id: true, title: true } } } } } },
    },
  });
}

export async function deleteMealPlan(userId: string, id: string) {
  const plan = await prisma.mealPlan.findFirst({ where: { id, userId } });
  if (!plan) throw new NotFoundError('Meal plan not found');
  await prisma.mealPlan.delete({ where: { id } });
  return { ok: true };
}


