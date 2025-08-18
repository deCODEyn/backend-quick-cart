import type { FastifyInstance } from 'fastify';
import {
  createOrder,
  getOrder,
  listAllOrders,
  listOrders,
  updateAllOrders,
  updateOrder,
} from '../controllers/order-controller.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAdminAuth } from '../middleware/validate-admin-auth.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  createOrderBodySchema,
  getOrderParamsSchema,
  updateOrderBodySchema,
  updateOrderStatusBodySchema,
} from '../schemas/routes-schemas/order-route-schema.ts';

export function orderRoutes(app: FastifyInstance) {
  app.register((publicRoutes) => {
    publicRoutes.addHook('preHandler', validateAuth);
    publicRoutes.addHook('onSend', renewToken);

    publicRoutes.post(
      '/orders',
      { schema: { body: createOrderBodySchema } },
      createOrder
    );
    publicRoutes.get('/orders', listOrders);
    publicRoutes.get(
      '/orders/:id',
      { schema: { params: getOrderParamsSchema } },
      getOrder
    );
    publicRoutes.patch(
      '/orders/:id',
      {
        schema: {
          params: getOrderParamsSchema,
          body: updateOrderBodySchema,
        },
      },
      updateOrder
    );
  });

  app.register((privateRoutes) => {
    privateRoutes.addHook('preHandler', validateAuth);
    privateRoutes.addHook('preHandler', validateAdminAuth);
    privateRoutes.addHook('onSend', renewToken);

    privateRoutes.get('/admin/orders', listAllOrders);
    privateRoutes.patch(
      '/admin/orders/:id/status',
      {
        schema: {
          params: getOrderParamsSchema,
          body: updateOrderStatusBodySchema,
        },
      },
      updateAllOrders
    );
  });
}
