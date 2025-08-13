import type { JWTPayload } from '../../types/global-types.ts';
import { NotFoundError } from '../../utils/errors.ts';

export function getUserId(user: JWTPayload): string {
  if (!user) {
    throw new NotFoundError('User not found.');
  }
  return user.userId;
}
