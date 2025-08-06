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

  reply.header('x-access-token', token);
  return reply.status(201).send({
    message: 'User registered successfully.',
    user: {
      name: newUser.name,
      email: newUser.email,
    },
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

  reply.header('x-access-token', token);
  return reply.status(200).send({ message: 'Login successfully.' });
}
