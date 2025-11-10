import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/errors';

export type IngredientInput = {
  name: string;
  category: string;
  amount?: number | null;
  unit?: string | null;
};

export async function listIngredients(userId: string) {
  return prisma.ingredient.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function createIngredient(userId: string, data: IngredientInput) {
  return prisma.ingredient.create({
    data: { ...data, userId },
  });
}

export async function updateIngredient(userId: string, id: string, data: IngredientInput) {
  const existing = await prisma.ingredient.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError('Ingredient not found');
  return prisma.ingredient.update({
    where: { id },
    data,
  });
}

export async function deleteIngredient(userId: string, id: string) {
  const existing = await prisma.ingredient.findFirst({ where: { id, userId } });
  if (!existing) throw new NotFoundError('Ingredient not found');
  await prisma.ingredient.delete({ where: { id } });
  return { ok: true };
}


