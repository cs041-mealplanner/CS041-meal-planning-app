import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().optional(),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().optional(),
  RECIPE_API_KEY: z.string().optional(),
  RECIPE_API_BASE: z.string().optional(),
});

envSchema.parse(process.env);


