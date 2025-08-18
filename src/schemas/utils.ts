import mongoose from 'mongoose';
import z from 'zod';
import { USER_ROLE_ENUM, VALID_SIZES_ENUM } from '../config/constants.ts';

export const jwtPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.email(),
  role: z.enum(USER_ROLE_ENUM),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

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

export const sizeEnumSchema = z.enum(VALID_SIZES_ENUM);
export type ValidSizeLiterals = z.infer<typeof sizeEnumSchema>;
