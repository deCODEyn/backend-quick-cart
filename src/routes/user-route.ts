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

export function userRoute(app: FastifyInstance) {
  app.post(
    '/api/user/register',
    {
      schema: {
        body: registerBodySchema,
      },
    },
    registerUser
  );
  app.post(
    '/api/user/login',
    {
      schema: {
        body: loginBodySchema,
      },
    },
    loginUser
  );
  app.get('/api/user/me', { preHandler: [validateAuth] }, getMe);
  app.post('/api/user/logout', logoutUser);
}
