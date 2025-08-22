import type { FastifyInstance } from 'fastify';
import {
  createAddress,
  deleteAddress,
  getAddress,
  listAddresses,
  updateAddress,
} from '../controllers/address-controller.ts';
import {
  createAddressBodySchema,
  getAddressParamsSchema,
  updateAddressBodySchema,
} from '../schemas/routes-schemas/address-route-schema.ts';
import { registerPrivateRoutes } from '../utils/route-decorators.ts';

export function addressRoutes(app: FastifyInstance) {
  registerPrivateRoutes(app, (privateRoutes) => {
    privateRoutes.post(
      '/',
      { schema: { body: createAddressBodySchema } },
      createAddress
    );
    privateRoutes.get('/', listAddresses);
    privateRoutes.get(
      '/:id',
      { schema: { params: getAddressParamsSchema } },
      getAddress
    );
    privateRoutes.patch(
      '/:id',
      {
        schema: {
          params: getAddressParamsSchema,
          body: updateAddressBodySchema,
        },
      },
      updateAddress
    );
    privateRoutes.delete(
      '/:id',
      { schema: { params: getAddressParamsSchema } },
      deleteAddress
    );
  });
}
