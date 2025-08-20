import { z } from 'zod';
import { ADDRESS_TYPE_ENUM, USER_ROLE_ENUM } from '../config/constants.ts';
import { numericString, objectIdSchema } from './utils.ts';

const socialMediaSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  X: z.string().optional(),
  linkedIn: z.string().optional(),
  whatsApp: numericString(),
});

const addressSchema = z.object({
  _id: objectIdSchema,
  type: z.enum(ADDRESS_TYPE_ENUM),
});

export const userSchema = z.object({
  email: z.email({ message: 'Invalid email format.' }),
  name: z
    .string()
    .min(2, { message: 'The name must have at least 2 characters.' }),
  password: z.string(),
  role: z.enum(USER_ROLE_ENUM).default('User'),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  cpf: numericString(11),
  rg: numericString(7),
  phoneNumber: numericString(),
  socialMedia: socialMediaSchema.optional(),
  addresses: z.array(addressSchema).optional(),
});
export type UserType = z.infer<typeof userSchema>;

export const userPublicSchema = userSchema
  .pick({
    name: true,
    email: true,
    role: true,
  })
  .extend({
    _id: objectIdSchema,
  });
export type UserPublicType = z.infer<typeof userPublicSchema>;
