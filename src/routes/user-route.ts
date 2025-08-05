import type { FastifyInstance } from 'fastify';
import { loginUser, registerUser } from '../controllers/user-controller.ts';
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
}
