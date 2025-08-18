import type { FastifyInstance } from 'fastify';
import {
  clearCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from '../controllers/cart-controller.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  deleteCartItemParamsSchema,
  postCartBodySchema,
} from '../schemas/routes-schemas/cart-route-schema.ts';

export function cartRoutes(app: FastifyInstance) {
  app.register((publicRoutes) => {
    publicRoutes.addHook('preHandler', validateAuth);
    publicRoutes.addHook('onSend', renewToken);

    publicRoutes.post(
      '/cart',
      { schema: { body: postCartBodySchema } },
      updateCartItem
    );
    publicRoutes.get('/cart', getCartItems);
    publicRoutes.delete(
      '/cart/:id/:size',
      { schema: { params: deleteCartItemParamsSchema } },
      deleteCartItem
    );
    publicRoutes.delete('/cart', clearCart);
  });
}
