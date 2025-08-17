import mongoose, { type Types } from 'mongoose';
import type { JWTPayload } from '../../types/global-types.ts';
import { NotFoundError } from '../../utils/errors.ts';

export function getUserId(user: JWTPayload | undefined): Types.ObjectId {
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  const userId = new mongoose.Types.ObjectId(user.userId);

  return userId;
}
