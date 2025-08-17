import z from 'zod';
import { VALID_SIZES_ENUM } from '../config/constants.ts';

export const productSchema = z.object({
  bestseller: z.boolean(),
  category: z.string().min(1, 'Category is required.'),
  description: z
    .string()
    .min(10, 'The description must be at least 10 characters long.'),
  image: z
    .array(z.string())
    .min(1, 'The product must have at least one image.'),
  name: z.string().min(3, 'The name must have at least 3 characters.'),
  price: z.number().positive('The price must be a positive value.'),
  sizes: z
    .array(z.enum(VALID_SIZES_ENUM))
    .min(1, 'The product must be at least one size.'),
  subCategory: z.string().min(1, 'Subcategory is required.'),
});

export type ProductType = z.infer<typeof productSchema>;
