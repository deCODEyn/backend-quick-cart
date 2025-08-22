import type { FastifyInstance } from 'fastify';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  uploadUserImage,
} from '../controllers/user-controller.ts';
import { preHandlerUserImage } from '../middleware/pre-handler-user-image.ts';
import {
  loginBodySchema,
  registerBodySchema,
  updateUserProfileSchema,
} from '../schemas/routes-schemas/user-route-schema.ts';
import { registerPrivateRoutes } from '../utils/route-decorators.ts';

export function userRoutes(app: FastifyInstance) {
  registerPrivateRoutes(app, (privateRoutes) => {
    privateRoutes.get('/me', getMe);
    privateRoutes.patch(
      '/avatar-image',
      { preHandler: [preHandlerUserImage] },
      uploadUserImage
    );
    privateRoutes.patch(
      '/profile',
      { schema: { body: updateUserProfileSchema } },
      updateUserProfile
    );
  });

  app.post('/register', { schema: { body: registerBodySchema } }, registerUser);
  app.post('/login', { schema: { body: loginBodySchema } }, loginUser);
  app.post('/logout', logoutUser);
}
