import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import { preHandlerCreateProduct } from '../middleware/pre-handler-create-product.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAdminAuth } from '../middleware/validate-admin-auth.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';

export function productRoutes(app: FastifyInstance) {
  app.register((publicRoutes) => {
    publicRoutes.get('/products', listProducts);
    publicRoutes.get(
      '/products/:id',
      { schema: { params: getProductParamsSchema } },
      getProduct
    );
  });

  app.register((privateRoutes) => {
    privateRoutes.addHook('preHandler', validateAuth);
    privateRoutes.addHook('preHandler', validateAdminAuth);
    privateRoutes.addHook('onSend', renewToken);

    privateRoutes.post(
      '/products',
      { preHandler: [preHandlerCreateProduct] },
      createProduct
    );
    privateRoutes.patch(
      '/products/:id',
      {
        schema: {
          params: getProductParamsSchema,
          body: updateProductBodySchema,
        },
      },
      updateProduct
    );
    privateRoutes.delete(
      '/products/:id',
      { schema: { params: getProductParamsSchema } },
      deleteProduct
    );
  });
}
