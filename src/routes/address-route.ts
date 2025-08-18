import type { FastifyInstance } from 'fastify';
import {
  createAddress,
  deleteAddress,
  getAddress,
  listAddresses,
  updateAddress,
} from '../controllers/address-controller.ts';
import { renewToken } from '../middleware/renew-token.ts';
import { validateAuth } from '../middleware/validate-auth.ts';
import {
  createAddressBodySchema,
  getAddressParamsSchema,
  updateAddressBodySchema,
} from '../schemas/routes-schemas/address-route-schema.ts';

export function addressRoutes(app: FastifyInstance) {
  app.register((publicRoutes) => {
    publicRoutes.addHook('preHandler', validateAuth);
    publicRoutes.addHook('onSend', renewToken);

    publicRoutes.post(
      '/address',
      { schema: { body: createAddressBodySchema } },
      createAddress
    );
    publicRoutes.get('/address', listAddresses);
    publicRoutes.get(
      '/address/:id',
      { schema: { params: getAddressParamsSchema } },
      getAddress
    );
    publicRoutes.patch(
      '/address/:id',
      {
        schema: {
          params: getAddressParamsSchema,
          body: updateAddressBodySchema,
        },
      },
      updateAddress
    );
    publicRoutes.delete(
      '/address/:id',
      { schema: { params: getAddressParamsSchema } },
      deleteAddress
    );
  });
}
