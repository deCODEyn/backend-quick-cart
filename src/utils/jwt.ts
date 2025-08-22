import jwt from 'jsonwebtoken';
import { AUTH_TOKEN_EXPIRATION_SECONDS } from '../config/constants.ts';
import { env } from '../env.ts';
import {
  type JWTPayload,
  jwtPayloadSchema,
} from '../schemas/zod-schema-utils.ts';

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: AUTH_TOKEN_EXPIRATION_SECONDS,
  });
}

export function verifyAndValidateToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const validatedPayload = jwtPayloadSchema.parse(decoded);

    return validatedPayload;
  } catch {
    return null;
  }
}
