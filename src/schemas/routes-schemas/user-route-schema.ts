import z from 'zod';
import { STRONG_PASSWORD_REGEX } from '../../config/constants.ts';
import { userSchema } from '../user-schema.ts';

export const registerBodySchema = userSchema.extend({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(STRONG_PASSWORD_REGEX, {
      message:
        'The password must contain uppercase and lowercase letters and at least one number or special character.',
    }),
});
export type RegisterBodyType = z.infer<typeof registerBodySchema>;

export const loginBodySchema = userSchema
  .pick({ email: true, password: true })
  .extend({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(100, { message: 'Password cannot exceed 100 characters.' }),
  });
export type LoginBodyType = z.infer<typeof loginBodySchema>;

export const updateUserProfileSchema = userSchema.omit({
  email: true,
  name: true,
  password: true,
  role: true,
  addresses: true,
  profileImage: true,
});
export type updateUserProfileType = z.infer<typeof updateUserProfileSchema>;
