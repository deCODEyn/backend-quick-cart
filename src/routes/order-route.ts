import type { FastifyInstance } from 'fastify';
import {
  createOrder,
  getOrder,
  listAllOrders,
  listOrders,
  updateAllOrders,
  updateOrder,
} from '../controllers/order-controller.ts';
import { validateAdminAuth } from '../middleware/validate-admin-auth.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  createOrderBodySchema,
  getOrderParamsSchema,
  updateOrderBodySchema,
  updateOrderStatusBodySchema,
} from '../schemas/routes-schemas/order-route-schema.ts';

export function orderRoute(app: FastifyInstance) {
  app.post(
    '/api/orders',
    {
      schema: { body: createOrderBodySchema },
      preHandler: validateAuth,
    },
    createOrder
  );
  app.get(
    '/api/orders',
    {
      preHandler: validateAuth,
    },
    listOrders
  );
  app.get(
    '/api/orders/:id',
    {
      schema: { params: getOrderParamsSchema },
      preHandler: validateAuth,
    },
    getOrder
  );
  app.patch(
    '/api/orders/:id',
    {
      schema: {
        params: getOrderParamsSchema,
        body: updateOrderBodySchema,
      },
      preHandler: validateAuth,
    },
    updateOrder
  );
  app.get(
    '/api/admin/orders',
    {
      preHandler: [validateAuth, validateAdminAuth],
    },
    listAllOrders
  );
  app.patch(
    '/api/admin/orders/:id/status',
    {
      schema: {
        params: getOrderParamsSchema,
        body: updateOrderStatusBodySchema,
      },
      preHandler: [validateAuth, validateAdminAuth],
    },
    updateAllOrders
  );
}
