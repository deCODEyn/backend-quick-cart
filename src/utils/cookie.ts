import type { FastifyReply } from 'fastify';
import { AUTH_TOKEN_EXPIRATION_SECONDS } from '../config/constants.ts';

export function setAuthCookie(reply: FastifyReply, token: string) {
  reply.setCookie('auth-token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_TOKEN_EXPIRATION_SECONDS,
  });
}

export function clearAuthCookie(reply: FastifyReply) {
  reply.clearCookie('auth-token');
}
