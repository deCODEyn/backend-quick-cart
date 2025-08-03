import type { MultipartFile } from '@fastify/multipart';
import z from 'zod';
import { productSchema } from '../product-schema.ts';

export const createProductBodySchema = productSchema.omit({
  image: true,
});
export type CreateProductBodyType = z.infer<typeof createProductBodySchema>;
export type CreateProductRequest = {
  Body: CreateProductBodyType & {
    [key: string]:
      | string
      | number
      | boolean
      | string[]
      | MultipartFile
      | undefined;
  };
};

export const updateProductBodySchema = productSchema.partial();
export type UpdateProductBodyType = z.infer<typeof updateProductBodySchema>;

export const getProductParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required.'),
});
export type GetProductParamsType = z.infer<typeof getProductParamsSchema>;
