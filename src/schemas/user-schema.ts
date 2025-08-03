import { z } from 'zod';

export const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'The name must have at least 2 characters.' }),
  email: z.email({ message: 'Invalid email format.' }),
  password: z.string(),
});

export type UserType = z.infer<typeof userSchema>;
