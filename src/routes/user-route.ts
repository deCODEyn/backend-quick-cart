import type { FastifyInstance } from 'fastify';
import {
  changePassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  uploadUserImage,
} from '../controllers/user-controller.ts';
import { preHandlerUserImage } from '../middleware/pre-handler-user-image.ts';
import {
  changePasswordSchema,
  loginBodySchema,
  registerBodySchema,
  updateUserProfileSchema,
} from '../schemas/routes-schemas/user-route-schema.ts';
import { registerPrivateRoutes } from '../utils/route-decorators.ts';

export function userRoutes(app: FastifyInstance) {
  app.post('/register', { schema: { body: registerBodySchema } }, registerUser);
  app.post('/login', { schema: { body: loginBodySchema } }, loginUser);
  app.post('/logout', logoutUser);

  registerPrivateRoutes(app, (privateRoutes) => {
    privateRoutes.get('/me', getMe);
    privateRoutes.patch(
      '/profile-image',
      { preHandler: [preHandlerUserImage] },
      uploadUserImage
    );
    privateRoutes.patch(
      '/profile',
      { schema: { body: updateUserProfileSchema } },
      updateUserProfile
    );
    privateRoutes.patch(
      '/profile/password',
      { schema: { body: changePasswordSchema } },
      changePassword
    );
  });
}
