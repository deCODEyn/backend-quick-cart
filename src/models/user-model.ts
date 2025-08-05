import bcrypt from 'bcrypt';
import mongoose, { type Document, type Model, type Types } from 'mongoose';
import { USER_ROLE_ENUM } from '../config/constants.ts';
import type { UserType } from '../schemas/user-schema.ts';

export interface UserDocumentInterface extends UserType, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  _id: Types.ObjectId;
}
export interface UserModelInterface extends Model<UserDocumentInterface> {}

const userDBSchema = new mongoose.Schema<
  UserDocumentInterface,
  UserModelInterface
>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      default: 'User',
      required: true,
    },
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

export const userModel = ((mongoose.models.User as UserModelInterface) ||
  mongoose.model<UserDocumentInterface, UserModelInterface>(
    'User',
    userDBSchema
  )) as mongoose.Model<UserDocumentInterface, UserModelInterface>;
