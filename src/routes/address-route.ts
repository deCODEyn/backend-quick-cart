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

export function addressRoute(app: FastifyInstance) {
  app.post(
    '/api/address',
    {
      schema: { body: createAddressBodySchema },
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    createAddress
  );
  app.get(
    '/api/address',
    {
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    listAddresses
  );
  app.get(
    '/api/address/:id',
    {
      schema: { params: getAddressParamsSchema },
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    getAddress
  );
  app.patch(
    '/api/address/:id',
    {
      schema: {
        params: getAddressParamsSchema,
        body: updateAddressBodySchema,
      },
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    updateAddress
  );
  app.delete(
    '/api/address/:id',
    {
      schema: {
        params: getAddressParamsSchema,
      },
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    deleteAddress
  );
}
