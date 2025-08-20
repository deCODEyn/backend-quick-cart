import bcrypt from 'bcrypt';
import mongoose, { type Document, type Model, type Types } from 'mongoose';
import {
  ADDRESS_TYPE_ENUM,
  NUMERIC_FIELDS,
  USER_ROLE_ENUM,
} from '../config/constants.ts';
import type { UserType } from '../schemas/user-schema.ts';
import { cleanNumericString } from '../utils/cleaner.ts';

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
    },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    cpf: { type: String, unique: true, sparse: true },
    rg: { type: String },
    phoneNumber: { type: String },
    socialMedia: {
      instagram: { type: String },
      facebook: { type: String },
      X: { type: String },
      linkedIn: { type: String },
      whatsApp: { type: String },
    },
    addresses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
        type: { type: String, enum: ADDRESS_TYPE_ENUM },
      },
    ],
  },
  { timestamps: true }
);

userDBSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      next(error as Error);
    }
  }

  for (const field of NUMERIC_FIELDS) {
    if (this.socialMedia && Object.hasOwn(this.socialMedia, field)) {
      const socialMediaPath = `socialMedia.${field}`;
      if (this.isModified(socialMediaPath) && this.get(socialMediaPath)) {
        this.set(
          socialMediaPath,
          cleanNumericString(this.get(socialMediaPath))
        );
      }
    } else if (this.isModified(field) && this.get(field)) {
      this.set(field, cleanNumericString(this.get(field)));
    }
  }

  next();
});

userDBSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

export const userModel =
  (mongoose.models.User as UserModelInterface) ||
  mongoose.model<UserDocumentInterface, UserModelInterface>(
    'User',
    userDBSchema
  );
