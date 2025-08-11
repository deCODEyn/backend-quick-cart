import mongoose from 'mongoose';
import z from 'zod';
import { USER_ROLE_ENUM } from '../config/constants.ts';

export const jwtPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.email(),
  role: z.enum(USER_ROLE_ENUM),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const objectIdSchema = z.custom<mongoose.Types.ObjectId>(
  (val) => {
    if (typeof val !== 'string') {
      return false;
    }
    mongoose.Types.ObjectId.isValid(val);
  },
  { message: 'Invalid ObjectId.' }
);
