import bcrypt from 'bcrypt';
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

userDBSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const userModel = (mongoose.models.user ||
  mongoose.model<UserType>('user', userDBSchema)) as mongoose.Model<UserType>;
