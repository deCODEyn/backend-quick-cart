import { z } from 'zod';
import { USER_ROLE_ENUM } from '../config/constants.ts';

export const userSchema = z.object({
  email: z.email({ message: 'Invalid email format.' }),
  name: z
    .string()
    .min(2, { message: 'The name must have at least 2 characters.' }),
  password: z.string(),
  role: z.enum(USER_ROLE_ENUM).default('User'),
});

export type UserType = z.infer<typeof userSchema>;
export type UserPublicType = Omit<UserType, 'password'> & {
  id: string;
};
