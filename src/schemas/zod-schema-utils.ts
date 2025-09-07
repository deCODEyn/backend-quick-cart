import mongoose from 'mongoose';
import z from 'zod';
import { USER_ROLE_ENUM, VALID_SIZES_ENUM } from '../config/constants.ts';
import { isCpfValid, isRgValid } from '../utils/validator.ts';

export const objectIdSchema = z
  .string({
    message: 'ID is required.',
  })
  .refine(
    (val) => {
      return mongoose.Types.ObjectId.isValid(val);
    },
    {
      message: 'Invalid ObjectId.',
    }
  )
  .transform((val) => {
    return new mongoose.Types.ObjectId(val);
  });
export type ObjectIdType = z.infer<typeof objectIdSchema>;

export const jwtPayloadSchema = z.object({
  userId: objectIdSchema,
  email: z.email(),
  role: z.enum(USER_ROLE_ENUM),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export const sizeEnumSchema = z.enum(VALID_SIZES_ENUM);
export type ValidSizeLiterals = z.infer<typeof sizeEnumSchema>;

export function numericString(minLength = 1) {
  return z
    .string()
    .optional()
    .transform((val) => val?.replace(/\D/g, ''))
    .refine((val) => !val || val.length >= minLength, {
      message: `Must have at least ${minLength} digits.`,
    });
}

export const cpfSchema = numericString(11).refine(
  (val) => !val || isCpfValid(val),
  { message: 'Invalid CPF.' }
);

export const rgSchema = numericString(7).refine(
  (val) => !val || isRgValid(val),
  { message: 'Invalid RG.' }
);
