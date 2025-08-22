import type { FastifyReply } from 'fastify';
import { AUTH_TOKEN_EXPIRATION_SECONDS } from '../config/constants.ts';

export function setAuthCookie(reply: FastifyReply, token: string) {
  return reply.setCookie('auth-token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_TOKEN_EXPIRATION_SECONDS,
  });
}

export function clearAuthCookie(reply: FastifyReply) {
  return reply.clearCookie('auth-token');
}
