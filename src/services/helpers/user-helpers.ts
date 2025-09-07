import mongoose, { type Types } from 'mongoose';
import {
  type UserDocumentInterface,
  userModel,
} from '../../models/user-model.ts';
import type { JWTPayload } from '../../schemas/zod-schema-utils.ts';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/errors.ts';

export function getUserId(user: JWTPayload | undefined): Types.ObjectId {
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  const userId = new mongoose.Types.ObjectId(user.userId);

  return userId;
}

export async function findUserById(
  userId: Types.ObjectId,
  showSecret?: boolean
): Promise<UserDocumentInterface> {
  let user: UserDocumentInterface | null;
  if (showSecret) {
    user = await userModel.findById({ _id: userId }).select('+password').exec();
  } else {
    user = await userModel.findById({ _id: userId }).exec();
  }
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await userModel.findOne({ email }).exec();
  if (user) {
    throw new ConflictError('User already registered.');
  }

  return;
}

export async function verifyPassword(
  user: UserDocumentInterface,
  passwordToCompare: string,
  shouldThrowError = true
): Promise<boolean> {
  const isMatch = await user.comparePassword(passwordToCompare);
  if (!isMatch && shouldThrowError) {
    throw new UnauthorizedError('Incorrect password.');
  }

  return isMatch;
}
