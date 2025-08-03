import type { FastifyReply, FastifyRequest } from 'fastify';
import { userModel } from '../models/user-model.ts';
import type {
  LoginBodyType,
  RegisterBodyType,
} from '../schemas/routes-schemas/user-route-schema.ts';
import { ConflictError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';

export async function registerUser(
  request: FastifyRequest<{ Body: RegisterBodyType }>,
  reply: FastifyReply
) {
  const { name, email, password } = request.body;

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    throw new ConflictError('User email already exists.');
  }

  const newUser = new userModel({ name, email, password });
  await newUser.save();

  const token = signToken({
    id: newUser._id.toString(),
    email: newUser.email,
  });

  return reply.status(201).send({
    message: 'User registered successfully.',
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
}

export function loginUser(
  request: FastifyRequest<{ Body: LoginBodyType }>,
  _reply: FastifyReply
) {
  const { email, password } = request.body;

  return { msg: 'Login API Working', email, password };
}

export function adminLogin(
  request: FastifyRequest<{ Body: LoginBodyType }>,
  _reply: FastifyReply
) {
  const { email, password } = request.body;

  return { msg: 'Admin login API Working', email, password };
}
