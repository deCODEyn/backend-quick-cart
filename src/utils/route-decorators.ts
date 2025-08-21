import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAdminAuth } from '../middleware/validate-admin-auth.ts';
import { validateAuth } from '../middleware/validate-auth.ts';

export function registerPrivateRoutes(
  app: FastifyInstance,
  routes: FastifyPluginCallback
) {
  app.register((privateRoutes) => {
    privateRoutes.addHook('preHandler', validateAuth);
    privateRoutes.addHook('onSend', renewToken);
    privateRoutes.register(routes);
  });
}

export function registerAdminRoutes(
  app: FastifyInstance,
  routes: FastifyPluginCallback
) {
  app.register((adminRoutes) => {
    adminRoutes.addHook('preHandler', validateAuth);
    adminRoutes.addHook('preHandler', validateAdminAuth);
    adminRoutes.addHook('onSend', renewToken);
    adminRoutes.register(routes);
  });
}
