import z from 'zod';
import { productSchema } from '../product-schema.ts';
import { objectIdSchema } from '../zod-schema-utils.ts';

export const createProductBodySchema = productSchema.omit({ image: true });
export type CreateProductBodyType = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = productSchema.partial().omit({
  image: true,
  name: true,
});
export type UpdateProductBodyType = z.infer<typeof updateProductBodySchema>;

export const getProductParamsSchema = z.object({
  id: objectIdSchema,
});
export type GetProductParamsType = z.infer<typeof getProductParamsSchema>;
