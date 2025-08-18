import type { FastifyReply, FastifyRequest } from 'fastify';
import { RENEW_WINDOW_MINUTES } from '../config/constants.ts';
import { setAuthCookie } from '../utils/cookie.ts';
import { TokenPayloadError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';

export function renewToken(
  request: FastifyRequest,
  reply: FastifyReply,
  _payload: unknown,
  done: () => void
): void {
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
      const newPayload = {
        userId: tokenPayload.userId,
        email: tokenPayload.email,
        role: tokenPayload.role,
      };
      const newToken = signToken(newPayload);
      setAuthCookie(reply, newToken);
    }
  }

  done();
}
