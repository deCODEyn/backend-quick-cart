import type { FastifyReply, FastifyRequest } from 'fastify';

export function createAddress(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    message: 'Rota createAddress -> Post: /api/address OK',
    success: true,
  });
}

export function listAddresses(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    message: 'Rota listAddresses -> Get: /api/address OK',
    success: true,
  });
}

export function getAddress(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    message: 'Rota getAddress -> Get: /api/address/:id OK',
    success: true,
  });
}

export function updateAddress(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    message: 'Rota updateAddress -> Patch: /api/address/:id OK',
    success: true,
  });
}

export function deleteAddress(_request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({
    message: 'Rota deleteAddress -> Delete: /api/address/:id OK',
    success: true,
  });
}
