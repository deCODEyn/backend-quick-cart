import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateAddressBodyType,
  GetAddressParamsType,
  updateAddressBodyType,
} from '../schemas/routes-schemas/address-route-schema.ts';
import {
  createAddressService,
  deleteAddressService,
  getAddressService,
  listAddressesService,
  updateAddressService,
} from '../services/address-service.ts';
import { getUserId } from '../services/helpers/user-helpers.ts';

export async function createAddress(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const body = request.body as CreateAddressBodyType;
  const result = await createAddressService(userId, body);

  return reply.status(201).send({
    message: 'Address create successfully',
    result,
    success: true,
  });
}

export async function listAddresses(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);

  return reply.status(200).send({
    result: await listAddressesService(userId),
    success: true,
  });
}

export async function getAddress(request: FastifyRequest, reply: FastifyReply) {
  const userId = getUserId(request.user);
  const { id: addressId } = request.params as GetAddressParamsType;

  return reply.status(200).send({
    result: await getAddressService(addressId, userId),
    success: true,
  });
}

export async function updateAddress(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const { id: addressId } = request.params as GetAddressParamsType;
  const updateData = request.body as updateAddressBodyType;

  reply.status(200).send({
    message: 'Address updated successfully.',
    result: await updateAddressService(userId, addressId, updateData),
    success: true,
  });
}

export async function deleteAddress(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const { id: addressId } = request.params as GetAddressParamsType;
  await deleteAddressService(userId, addressId);

  reply.status(200).send({
    message: 'Address deleted successfully.',
    success: true,
  });
}
