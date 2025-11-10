import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/auth';
import { generateGroceryList } from './service';

const router = Router();

const bodySchema = z.object({
  planId: z.string().min(1),
});

router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const { planId } = bodySchema.parse(req.body);
    const result = await generateGroceryList(req.user!.id, planId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;


