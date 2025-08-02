import jwt from 'jsonwebtoken';
import z from 'zod';
import { env } from '../env.ts';

export const jwtPayloadSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
});

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '2h' });
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
