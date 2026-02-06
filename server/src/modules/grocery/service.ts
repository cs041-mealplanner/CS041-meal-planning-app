import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/errors';

type MergedItem = { name: string; amount?: number | null; unit?: string | null; category?: string | null };

export async function generateGroceryList(userId: string, planId: string) {
  const plan = await prisma.mealPlan.findFirst({
    where: { id: planId, userId },
    include: {
      meals: {
        include: {
          recipes: {
            include: {
              recipe: { include: { ingredients: true } },
            },
          },
        },
      },
    },
  });
  if (!plan) throw new NotFoundError('Meal plan not found');

  const bucket = new Map<string, MergedItem>();
  for (const meal of plan.meals) {
    for (const mr of meal.recipes) {
      for (const ing of mr.recipe.ingredients) {
        const key = `${ing.name.toLowerCase().trim()}::${ing.unit ?? ''}`;
        const prev = bucket.get(key);
        const nextAmount =
          (prev?.amount ?? 0) + (typeof ing.amount === 'number' ? ing.amount : 0);
        bucket.set(key, {
          name: ing.name,
          unit: ing.unit,
          category: ing.category,
          amount: nextAmount || undefined,
        });
      }
    }
  }
  const items = Array.from(bucket.values());

  const list = await prisma.groceryList.create({
    data: {
      userId,
      planId,
      items: {
        create: items.map((it) => ({
          name: it.name,
          unit: it.unit,
          category: it.category,
          amount: it.amount ?? null,
        })),
      },
    },
    include: { items: true },
  });

  return {
    planId: list.planId,
    items: list.items.map((i) => ({
      name: i.name,
      quantity: i.amount != null ? `${i.amount}${i.unit ? ` ${i.unit}` : ''}` : '',
      category: i.category ?? undefined,
    })),
  };
}


