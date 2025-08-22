import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  LoginBodyType,
  RegisterBodyType,
  updateUserProfileType,
} from '../schemas/routes-schemas/user-route-schema.ts';
import {
  findUserByEmail,
  getUserId,
} from '../services/helpers/user-helpers.ts';
import {
  authenticateUser,
  createUser,
  getAuthenticatedUserService,
  updateUserProfileService,
  uploadUserImageService,
} from '../services/user-service.ts';
import type { FastifyUserImageBody } from '../types/global-types.ts';
import { clearAuthCookie, setAuthCookie } from '../utils/cookie.ts';
import { UnauthorizedError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userData = request.body as RegisterBodyType;
  await findUserByEmail(userData.email);
  const newUser = await createUser(userData);
  const token = signToken({
    userId: newUser._id,
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

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as LoginBodyType;
  const token = await authenticateUser(email, password);
  if (!token) {
    throw new UnauthorizedError('Invalid credentials.');
  }
  setAuthCookie(reply, token);

  return reply.status(200).send({
    message: 'Login successful.',
    success: true,
  });
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user?.userId) {
    throw new UnauthorizedError('User is not logged in.');
  }
  const user = await getAuthenticatedUserService(getUserId(request.user));

  return reply.status(200).send({
    message: 'User profile fetched successfully.',
    result: user,
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

export async function uploadUserImage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const { profileImage } = request as FastifyUserImageBody;
  await uploadUserImageService(userId, profileImage);

  return reply.status(200).send({
    message: 'Profile image uploaded successfully.',
    success: true,
  });
}

export async function updateUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const updateData = request.body as updateUserProfileType;

  return reply.status(200).send({
    message: 'Updated profile successfully',
    result: await updateUserProfileService(userId, updateData),
    success: true,
  });
}
