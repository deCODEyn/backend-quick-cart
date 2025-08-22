import type { FastifyInstance } from 'fastify';
import { addressRoutes } from '../routes/address-route.ts';
import { cartRoutes } from '../routes/cart-route.ts';
import { orderRoutes } from '../routes/order-route.ts';
import { productRoutes } from '../routes/product-route.ts';
import { userRoutes } from '../routes/user-route.ts';

export function appRoutes(app: FastifyInstance) {
  app.register(
    (routes) => {
      routes.register(userRoutes, { prefix: '/users' });
      routes.register(productRoutes, { prefix: '/products' });
      routes.register(cartRoutes, { prefix: '/cart' });
      routes.register(addressRoutes, { prefix: '/address' });
      routes.register(orderRoutes, { prefix: '/orders' });
    },
    { prefix: '/api' }
  );
}
