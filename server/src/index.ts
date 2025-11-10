import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './modules/auth/routes';
import groceryRoutes from './modules/grocery/routes';
import ingredientsRoutes from './modules/ingredients/routes';
import mealPlanRoutes from './modules/mealplans/routes';
import recipeRoutes from './modules/recipes/routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/grocery-list', groceryRoutes);
app.use('/api/recipes', recipeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on ${PORT}`);
  });
}

export default app;


