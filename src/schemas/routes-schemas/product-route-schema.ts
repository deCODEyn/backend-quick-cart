import z from 'zod';
import { productSchema } from '../product-schema.ts';

export const createProductBodySchema = productSchema.omit({ image: true });
export type CreateProductBodyType = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = productSchema.partial().omit({
  image: true,
  name: true,
});
export type UpdateProductBodyType = z.infer<typeof updateProductBodySchema>;

export const getProductParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required.'),
});
export type GetProductParamsType = z.infer<typeof getProductParamsSchema>;
