import type { FastifyReply, FastifyRequest } from 'fastify';
import { RENEW_WINDOW_MINUTES } from '../config/constants.ts';
import { TokenPayloadError } from '../utils/errors.ts';
import { type JWTPayload, signToken } from '../utils/jwt.ts';

export function renewToken(request: FastifyRequest, reply: FastifyReply): void {
  if (reply.statusCode >= 200 && reply.statusCode < 300 && request.user) {
    const payload = request.user;
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === 'undefined') {
      throw new TokenPayloadError('Token expiration time not found.');
    }
    const expiresInSeconds = payload.exp - nowInSeconds;

    if (expiresInSeconds < RENEW_WINDOW_MINUTES * 60) {
      const newToken = signToken(payload as JWTPayload);
      reply.header('x-access-token', newToken);
    }
  }
  return;
}
