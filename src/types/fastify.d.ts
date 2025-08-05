import 'fastify';
import type { JWTPayload } from '../utils/jwt.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
