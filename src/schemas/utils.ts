import mongoose from 'mongoose';
import z from 'zod';

export const objectIdSchema = z.custom<mongoose.Types.ObjectId>(
  (val) => {
    if (typeof val !== 'string') {
      return false;
    }
    mongoose.Types.ObjectId.isValid(val);
  },
  { message: 'Invalid ObjectId.' }
);
