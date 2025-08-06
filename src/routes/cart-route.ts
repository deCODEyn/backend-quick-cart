import type { FastifyInstance } from 'fastify';
import {
  clearCart,
  deleteCartItem,
  updateCartItem,
} from '../controllers/cart-controller.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  deleteCartItemParamsSchema,
  postCartBodySchema,
} from '../schemas/routes-schemas/cart-route-schema.ts';

export function cartRoute(app: FastifyInstance) {
  app.post(
    '/api/cart',
    {
      schema: { body: postCartBodySchema },
      preHandler: validateAuth,
    },
    updateCartItem
  );
  app.delete(
    '/api/cart/:id/:size',
    {
      schema: { params: deleteCartItemParamsSchema },
      preHandler: validateAuth,
    },
    deleteCartItem
  );
  app.delete(
    '/api/cart',
    {
      preHandler: validateAuth,
    },
    clearCart
  );
}
