import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { RENEW_WINDOW_MINUTES } from '../config/constants.ts';
import { TokenPayloadError } from '../utils/errors.ts';
import { type JWTPayload, signToken } from '../utils/jwt.ts';

export function renewToken(
  request: FastifyRequest,
  reply: FastifyReply,
  _payload: unknown,
  done: HookHandlerDoneFunction
): void {
  try {
    if (reply.statusCode >= 200 && reply.statusCode < 300 && request.user) {
      const tokenPayload = request.user;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (typeof tokenPayload.exp === 'undefined') {
        throw new TokenPayloadError('Token expiration time not found.');
      }

      const expiresInSeconds = tokenPayload.exp - nowInSeconds;
      if (expiresInSeconds < RENEW_WINDOW_MINUTES * 60) {
        const newToken = signToken(tokenPayload as JWTPayload);
        reply.header('x-access-token', newToken);
      }
    }

    done();
  } catch (error) {
    done(error as Error);
  }
}
