import mongoose from 'mongoose';
import type { UserType } from '../schemas/user-schema.ts';

const userDBSchema = new mongoose.Schema<UserType>(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

export const userModel = (mongoose.models.user ||
  mongoose.model<UserType>('user', userDBSchema)) as mongoose.Model<UserType>;
