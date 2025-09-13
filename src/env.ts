import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  MONGODB_URI: z.string().url().startsWith('mongodb+srv://'),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_SECRET_KEY: z.string(),
  CLOUDINARY_NAME: z.string(),
  JWT_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
