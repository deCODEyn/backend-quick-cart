import { z } from 'zod';
import { cartItemBaseSchema } from '../cart-schema.ts';

export const postCartBodySchema = cartItemBaseSchema.extend({
  quantity: z
    .number()
    .int('The quantity must be a whole number.')
    .min(0, 'The quantity must be at least 0.'),
});

export const deleteCartItemParamsSchema = cartItemBaseSchema;

export type PostCartBodyType = z.infer<typeof postCartBodySchema>;
export type DeleteCartItemParamsType = z.infer<
  typeof deleteCartItemParamsSchema
>;
