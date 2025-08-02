import z from 'zod';
import { userSchema } from '../user-schema.ts';

export type LoginBodyType = z.infer<typeof loginBodySchema>;
export type RegisterBodyType = z.infer<typeof registerBodySchema>;

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/;

export const registerBodySchema = userSchema.omit({ _id: true }).extend({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(strongPasswordRegex, {
      message:
        'The password must contain uppercase and lowercase letters and at least one number or special character.',
    }),
});

export const loginBodySchema = userSchema
  .pick({ email: true, password: true })
  .extend({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(100, { message: 'Password cannot exceed 100 characters.' }),
  });
