import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import { preValidateAndParseProduct } from '../hooks/pre-handler-product.ts';
import {
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';


export function productRoute(app: FastifyInstance) {
  app.post(
    '/api/products',
    {
      preHandler: preValidateAndParseProduct,
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
