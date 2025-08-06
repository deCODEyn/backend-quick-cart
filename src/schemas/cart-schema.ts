import { z } from 'zod';
import { VALID_SIZES_ENUM } from '../config/constants.ts';
import { objectIdSchema } from './utils.ts';

export const cartItemBaseSchema = z.object({
  id: z.string().nonempty('Product ID cannot be empty.'),
  size: z.enum(VALID_SIZES_ENUM),
});

export const cartItemSchema = cartItemBaseSchema.extend({
  quantity: z
    .number()
    .int('The quantity must be a whole number.')
    .min(1, 'The quantity must be at least 1.'),
});

export const cartSchema = z.object({
  userId: objectIdSchema,
  items: z.array(cartItemSchema),
});

export type CartType = z.infer<typeof cartSchema>;
