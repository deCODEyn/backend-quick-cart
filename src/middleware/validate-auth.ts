import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../utils/errors.ts';
import { verifyAndValidateToken } from '../utils/jwt.ts';

export function validateAuth(
  request: FastifyRequest,
  _reply: FastifyReply
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token not provided or malformed.');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAndValidateToken(token);

  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token.');
  }

  request.user = payload;
}
