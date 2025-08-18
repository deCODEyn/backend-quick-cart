import type { FastifyInstance } from 'fastify';
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/user-controller.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  loginBodySchema,
  registerBodySchema,
} from '../schemas/routes-schemas/user-route-schema.ts';

export function userRoutes(app: FastifyInstance) {
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
    publicRoutes.get('/user/me', { preHandler: [validateAuth] }, getMe);
    publicRoutes.post('/user/logout', logoutUser);
  });
}
