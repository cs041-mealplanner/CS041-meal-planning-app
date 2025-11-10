import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { searchRecipes } from './service';

const router = Router();

router.use(requireAuth);

router.get('/search', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;
    const data = await searchRecipes({ category, keyword });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;


