import 'fastify';
import type { JWTPayload } from './global-types.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
