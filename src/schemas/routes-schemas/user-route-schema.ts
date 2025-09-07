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

export const updateUserProfileSchema = userSchema
  .omit({
    name: true,
    password: true,
    role: true,
    addresses: true,
    profileImage: true,
  })
  .extend({
    email: z.email().optional(),
    currentPassword: z.string().min(1, 'The current password is required.'),
  });
export type updateUserProfileType = z.infer<typeof updateUserProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'The current password is required.'),
  newPassword: z
    .string()
    .min(8, 'The new password must be at least 8 characters long.'),
});
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
