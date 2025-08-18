import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../utils/errors.ts';

export function validateAdminAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: () => void
): void {
  const user = request.user;
  if (user?.role !== 'Admin') {
    throw new UnauthorizedError('Access denied: Insufficient privileges.');
  }
  done();
}
