import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import { preHandlerProduct } from '../middleware/pre-handler-product.ts';
import {
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';

export function productRoute(app: FastifyInstance) {
  app.post(
    '/api/products',
    {
      preHandler: preHandlerProduct,
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
    },
    updateProduct
  );
  app.delete(
    '/api/products/:id',
    {
      schema: {
        params: getProductParamsSchema,
      },
    },
    deleteProduct
  );
}
