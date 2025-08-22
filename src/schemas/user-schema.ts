import { z } from 'zod';
import { ADDRESS_TYPE_ENUM, USER_ROLE_ENUM } from '../config/constants.ts';
import {
  cpfSchema,
  numericString,
  objectIdSchema,
  rgSchema,
} from './zod-schema-utils.ts';

const socialMediaSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  X: z.string().optional(),
  linkedIn: z.string().optional(),
  whatsApp: numericString().optional(),
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
  cpf: cpfSchema,
  rg: rgSchema,
  phoneNumber: numericString().optional(),
  socialMedia: socialMediaSchema.optional(),
  addresses: z.array(addressSchema).optional(),
  profileImage: z.string().optional(),
});
export type UserType = z.infer<typeof userSchema>;

export const userPublicSchema = userSchema
  .omit({
    password: true,
    addresses: true,
  })
  .extend({
    _id: objectIdSchema,
  });
export type UserPublicType = z.infer<typeof userPublicSchema>;
