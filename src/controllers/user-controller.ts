import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  LoginBodyType,
  RegisterBodyType,
} from '../schemas/routes-schemas/user-route-schema.ts';
import {
  authenticateUser,
  createUser,
  findUserByEmail,
} from '../services/user-service.ts';
import type { JWTPayload } from '../types/global-types.ts';
import { clearAuthCookie, setAuthCookie } from '../utils/cookie.ts';
import { BadRequestError, ConflictError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';

export async function registerUser(
  request: FastifyRequest<{ Body: RegisterBodyType }>,
  reply: FastifyReply
) {
  const userData = request.body;

  const userExists = await findUserByEmail(userData.email);
  if (userExists) {
    throw new ConflictError('User email already exists.');
  }

  const newUser = await createUser(userData);
  const token = signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  setAuthCookie(reply, token);

  const user = {
    name: newUser.name,
    email: newUser.email,
  };

  return reply.status(201).send({
    message: 'User registered successfully.',
    result: user,
    success: true,
  });
}

export async function loginUser(
  request: FastifyRequest<{ Body: LoginBodyType }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const token = await authenticateUser(email, password);
  if (!token) {
    throw new BadRequestError('Invalid credentials.');
  }

  setAuthCookie(reply, token);

  return reply
    .status(200)
    .send({ message: 'Login successfully.', success: true });
}

export function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as JWTPayload;

  return reply.status(200).send({
    message: 'User profile fetched successfully.',
    result: { email: user.email, role: user.role },
    success: true,
  });
}

export function logoutUser(_request: FastifyRequest, reply: FastifyReply) {
  clearAuthCookie(reply);

  return reply.status(200).send({
    message: 'Logout successful.',
    success: true,
  });
}
