import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import { preHandlerProduct } from '../middleware/pre-handler-product.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAdminAuth } from '../middleware/validate-admin-auth.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';

export function productRoute(app: FastifyInstance) {
  app.post(
    '/api/products',
    {
      preHandler: [validateAuth, validateAdminAuth, preHandlerProduct],
      onSend: renewToken,
    },
    createProduct
  );
  app.get('/api/products', listProducts);
  app.get(
    '/api/products/:id',
    {
      schema: {
        params: getProductParamsSchema,
      },
    },
    getProduct
  );
  app.patch(
    '/api/products/:id',
    {
      schema: {
        params: getProductParamsSchema,
        body: updateProductBodySchema,
      },
      preHandler: [validateAuth, validateAdminAuth],
      onSend: renewToken,
    },
    updateProduct
  );
  app.delete(
    '/api/products/:id',
    {
      schema: {
        params: getProductParamsSchema,
      },
      preHandler: [validateAuth, validateAdminAuth],
      onSend: renewToken,
    },
    deleteProduct
  );
}
