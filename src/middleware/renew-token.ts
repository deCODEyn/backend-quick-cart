import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import { RENEW_WINDOW_MINUTES } from '../config/constants.ts';
import type { JWTPayload } from '../types/global-types.ts';
import { setAuthCookie } from '../utils/cookie.ts';
import { TokenPayloadError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';

export function renewToken(
  request: FastifyRequest,
  reply: FastifyReply,
  _payload: unknown,
  done: HookHandlerDoneFunction
): void {
  try {
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
      const tokenPayload = request.user;
      if (!tokenPayload || typeof tokenPayload.exp === 'undefined') {
        throw new TokenPayloadError(
          'Token expiration time not found or user not authenticated.'
        );
      }

      const nowInSeconds = Math.floor(Date.now() / 1000);
      const expiresInSeconds = tokenPayload.exp - nowInSeconds;
      if (expiresInSeconds < RENEW_WINDOW_MINUTES * 60) {
        const newToken = signToken(tokenPayload as JWTPayload);
        setAuthCookie(reply, newToken);
      }
    }

    done();
  } catch (error) {
    done(error as Error);
  }
}
