import type { FastifyInstance } from 'fastify';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product-controller.ts';
import { preHandlerCreateProduct } from '../middleware/pre-handler-create-product.ts';
import {
  getProductParamsSchema,
  updateProductBodySchema,
} from '../schemas/routes-schemas/product-route-schema.ts';
import { registerAdminRoutes } from '../utils/route-decorators.ts';

export function productRoutes(app: FastifyInstance) {
  app.get('/', listProducts);
  app.get(
    '/:id',
    { schema: { params: getProductParamsSchema } },
    getProduct
  );

  registerAdminRoutes(app, (adminRoutes) => {
    adminRoutes.post(
      '/',
      { preHandler: [preHandlerCreateProduct] },
      createProduct
    );
    adminRoutes.patch(
      '/:id',
      {
        schema: {
          params: getProductParamsSchema,
          body: updateProductBodySchema,
        },
      },
      updateProduct
    );
    adminRoutes.delete(
      '/:id',
      { schema: { params: getProductParamsSchema } },
      deleteProduct
    );
  });
}
