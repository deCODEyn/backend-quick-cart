import { z } from 'zod';

export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'The name must have at least 2 characters.'),
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(100, 'Password cannot exceed 100 characters.'),
});

export type UserType = z.infer<typeof userSchema>;
