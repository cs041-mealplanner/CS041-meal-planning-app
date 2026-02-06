import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { createIngredient, deleteIngredient, listIngredients, updateIngredient } from './service';

const router = Router();

const categoryEnum = z.enum(['vegetable', 'meat', 'spice', 'dairy', 'grain', 'fruit', 'other']);
const ingredientSchema = z.object({
  name: z.string().min(1),
  category: categoryEnum,
  amount: z.number().nonnegative().optional(),
  unit: z.string().optional(),
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const rows = await listIngredients(userId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = ingredientSchema.parse(req.body);
    const row = await createIngredient(userId, data);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const data = ingredientSchema.parse(req.body);
    const row = await updateIngredient(userId, id, data);
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const result = await deleteIngredient(userId, id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;


