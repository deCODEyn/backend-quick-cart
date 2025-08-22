import type { FastifyInstance } from 'fastify';
import {
  clearCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from '../controllers/cart-controller.ts';
import {
  deleteCartItemParamsSchema,
  postCartBodySchema,
} from '../schemas/routes-schemas/cart-route-schema.ts';
import { registerPrivateRoutes } from '../utils/route-decorators.ts';

export function cartRoutes(app: FastifyInstance) {
  registerPrivateRoutes(app, (privateRoutes) => {
    privateRoutes.post(
      '/',
      { schema: { body: postCartBodySchema } },
      updateCartItem
    );
    privateRoutes.get('/', getCartItems);
    privateRoutes.delete(
      '/:id/:size',
      { schema: { params: deleteCartItemParamsSchema } },
      deleteCartItem
    );
    privateRoutes.delete('/', clearCart);
  });
}
