import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../utils/errors.ts';
import { verifyAndValidateToken } from '../utils/jwt.ts';

export function validateAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: () => void
): void {
  const token = request.cookies['auth-token'];
  if (!token) {
    throw new UnauthorizedError('Token not provided.');
  }

  const payload = verifyAndValidateToken(token);
  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token.');
  }

  request.user = payload;
  done();
}
