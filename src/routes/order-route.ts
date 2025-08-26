import type { FastifyInstance } from 'fastify';
import {
  createOrder,
  getOrder,
  listAllOrders,
  listOrders,
  updateAllOrders,
  updateOrder,
} from '../controllers/order-controller.ts';
import {
  createOrderBodySchema,
  getOrderParamsSchema,
  updateOrderBodySchema,
  updateOrderStatusBodySchema,
} from '../schemas/routes-schemas/order-route-schema.ts';
import {
  registerAdminRoutes,
  registerPrivateRoutes,
} from '../utils/route-decorators.ts';

export function orderRoutes(app: FastifyInstance) {
  registerPrivateRoutes(app, (privateRoutes) => {
    privateRoutes.post(
      '/',
      { schema: { body: createOrderBodySchema } },
      createOrder
    );
    privateRoutes.get('/', listOrders);
    privateRoutes.get(
      '/:id',
      { schema: { params: getOrderParamsSchema } },
      getOrder
    );
    privateRoutes.patch(
      '/:id',
      {
        schema: {
          params: getOrderParamsSchema,
          body: updateOrderBodySchema,
        },
      },
      updateOrder
    );
  });

  registerAdminRoutes(app, (adminRoutes) => {
    adminRoutes.get('/', listAllOrders);
    adminRoutes.patch(
      '/:id/status',
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
