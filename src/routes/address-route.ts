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

export function addressRoute(app: FastifyInstance) {
  app.post(
    '/api/address',
    {
      schema: {},
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    createAddress
  );
  app.get(
    '/api/address',
    {
      schema: {},
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    listAddresses
  );
  app.get(
    '/api/address/:id',
    {
      schema: {},
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    getAddress
  );
  app.patch(
    '/api/address/:id',
    {
      schema: {},
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    updateAddress
  );
  app.delete(
    '/api/address/:id',
    {
      schema: {},
      preHandler: [validateAuth],
      onSend: renewToken,
    },
    deleteAddress
  );
}
