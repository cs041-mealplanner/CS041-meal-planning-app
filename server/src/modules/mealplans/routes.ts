import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { createMealPlan, deleteMealPlan, listMealPlans, updateMealPlan } from './service';

const router = Router();

const mealSchema = z.object({
  time: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  recipes: z.array(z.string().min(1)),
});

const planSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meals: z.array(mealSchema),
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const rows = await listMealPlans(req.user!.id);
    res.json(
      rows.map((p) => ({
        id: p.id,
        date: p.date.toISOString().slice(0, 10),
        meals: p.meals.map((m) => ({
          time: m.time,
          recipes: m.recipes.map((mr) => ({ id: mr.recipe.id, title: mr.recipe.title })),
        })),
      })),
    );
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = planSchema.parse(req.body);
    const plan = await createMealPlan(req.user!.id, body);
    res.status(201).json({
      id: plan.id,
      date: plan.date.toISOString().slice(0, 10),
      meals: plan.meals.map((m) => ({
        time: m.time,
        recipes: m.recipes.map((mr) => ({ id: mr.recipe.id, title: mr.recipe.title })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const body = planSchema.parse(req.body);
    const plan = await updateMealPlan(req.user!.id, req.params.id, body);
    res.json({
      id: plan!.id,
      date: plan!.date.toISOString().slice(0, 10),
      meals: plan!.meals.map((m) => ({
        time: m.time,
        recipes: m.recipes.map((mr) => ({ id: mr.recipe.id, title: mr.recipe.title })),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteMealPlan(req.user!.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;


