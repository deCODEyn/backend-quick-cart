import mongoose, { type Types } from 'mongoose';
import {
  type UserDocumentInterface,
  userModel,
} from '../../models/user-model.ts';
import type { JWTPayload } from '../../schemas/zod-schema-utils.ts';
import { NotFoundError } from '../../utils/errors.ts';

export function getUserId(user: JWTPayload | undefined): Types.ObjectId {
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  const userId = new mongoose.Types.ObjectId(user.userId);

  return userId;
}

export async function findUserById(
  userId: Types.ObjectId
): Promise<UserDocumentInterface> {
  const user = await userModel.findById({ _id: userId }).exec();
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  return user;
}

export async function findUserByEmail(
  email: string
): Promise<UserDocumentInterface> {
  const user = await userModel.findOne({ email }).exec();
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  return user;
}
