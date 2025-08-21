import type { FastifyInstance } from 'fastify';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  uploadUserImage,
} from '../controllers/user-controller.ts';
import { preHandlerUserImage } from '../middleware/pre-handler-user-image.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  loginBodySchema,
  registerBodySchema,
} from '../schemas/routes-schemas/user-route-schema.ts';

export function userRoutes(app: FastifyInstance) {
  app.register((privateRoutes) => {
    privateRoutes.addHook('preHandler', validateAuth);
    privateRoutes.addHook('onSend', renewToken);

    privateRoutes.get('/user/me', getMe);
    privateRoutes.patch(
      '/user/avatar-image',
      { preHandler: [preHandlerUserImage] },
      uploadUserImage
    );
  });

  app.register((publicRoutes) => {
    publicRoutes.post(
      '/user/register',
      { schema: { body: registerBodySchema } },
      registerUser
    );
    publicRoutes.post(
      '/user/login',
      { schema: { body: loginBodySchema } },
      loginUser
    );
    publicRoutes.post('/user/logout', logoutUser);
  });
}
