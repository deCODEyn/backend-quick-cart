import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { UnauthorizedError } from '../utils/errors.ts';

export function validateAdminAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const user = request.user;
  if (user?.role !== 'Admin') {
    throw new UnauthorizedError('Access denied: Insufficient privileges.');
  }
  done();
}
