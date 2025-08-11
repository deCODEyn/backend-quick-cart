import jwt from 'jsonwebtoken';
import z from 'zod';
import {
  AUTH_TOKEN_EXPIRATION_SECONDS,
  USER_ROLE_ENUM,
} from '../config/constants.ts';
import { env } from '../env.ts';

export const jwtPayloadSchema = z.object({
  userId: z.string().min(1),
  email: z.email(),
  role: z.enum(USER_ROLE_ENUM),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

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
