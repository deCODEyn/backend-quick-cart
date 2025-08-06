import type { FastifyInstance } from 'fastify';
import { updateCartItem } from '../controllers/cart-controller.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import { postCartBodySchema } from '../schemas/routes-schemas/cart-route-schema.ts';

export function cartRoute(app: FastifyInstance) {
  app.post(
    '/api/cart',
    {
      schema: { body: postCartBodySchema },
      preHandler: validateAuth,
    },
    updateCartItem
  );
}
