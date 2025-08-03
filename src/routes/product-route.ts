import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import {
  createProductBodySchema,
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';

export function productRoute(app: FastifyInstance) {
  app.post(
    '/api/products',
    {
      schema: {
        body: createProductBodySchema,
      },
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
  app.put(
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
