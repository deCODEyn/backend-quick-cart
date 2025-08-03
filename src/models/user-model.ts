import bcrypt from 'bcrypt';
import mongoose, { type Document, type Model, type Types } from 'mongoose';
import type { UserType } from '../schemas/user-schema.ts';

export interface UserDocumentInterface extends UserType, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModelInterface extends Model<UserDocumentInterface> {}

const userDBSchema = new mongoose.Schema<
  UserDocumentInterface,
  UserModelInterface
>(
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

userDBSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

export const userModel = ((mongoose.models.user as UserModelInterface) ||
  mongoose.model<UserDocumentInterface, UserModelInterface>(
    'user',
    userDBSchema
  )) as mongoose.Model<UserDocumentInterface, UserModelInterface>;
