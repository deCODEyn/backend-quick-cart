import { z } from 'zod';

export const cartItemSchema = z.object({
  id: z.string().nonempty('Product ID cannot be empty.'),
  size: z.string().nonempty('Product size cannot be empty.'),
  quantity: z
    .number()
    .int('The quantity must be a whole number.')
    .min(1, 'The quantity must be at least 1.'),
});

export const cartSchema = z.object({
  userId: z.string().optional(),
  items: z.array(cartItemSchema),
});

export type CartType = z.infer<typeof cartSchema>;
