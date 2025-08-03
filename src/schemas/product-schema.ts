import z from 'zod';

export const VALID_SIZES_ENUM = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const productSchema = z.object({
  bestseller: z.boolean(),
  category: z.string().min(1, 'Category is required.'),
  date: z.number().int().positive('Date must be a positive numeric value.'),
  description: z
    .string()
    .min(10, 'The description must be at least 10 characters long.'),
  name: z.string().min(3, 'The name must have at least 3 characters.'),
  image: z
    .array(z.string())
    .min(1, 'The product must have at least one image.'),
  price: z.number().positive('The price must be a positive value.'),
  sizes: z
    .array(z.enum(VALID_SIZES_ENUM))
    .min(1, 'The product must be at least one size.'),
  subCategory: z.string().min(1, 'A subcategoria é obrigatória.'),
});

export type ProductType = z.infer<typeof productSchema>;
