import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  CreateOrderBodyType,
  GetOrderParamsType,
  UpdateOrderBodyType,
  UpdateOrderStatusBodyType,
} from '../schemas/routes-schemas/order-route-schema.ts';
import { getUserId } from '../services/helpers/user-helpers.ts';
import {
  createOrderService,
  getOrderService,
  listAllOrdersService,
  listOrdersService,
  updateAllOrdersService,
  updateOrderService,
} from '../services/order-service.ts';

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const body = request.body as CreateOrderBodyType;

  return reply.status(201).send({
    message: 'Order created successfully.',
    result: await createOrderService(userId, body),
    success: true,
  });
}

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  const userId = getUserId(request.user);

  return reply.status(200).send({
    message: 'Orders listed successfully.',
    result: await listOrdersService(userId),
    success: true,
  });
}

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const userId = getUserId(request.user);
  const { id: orderId } = request.params as GetOrderParamsType;

  return reply.status(200).send({
    message: 'Order retrieved successfully.',
    result: await getOrderService(userId, orderId),
    success: true,
  });
}

export async function updateOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = getUserId(request.user);
  const { id: orderId } = request.params as GetOrderParamsType;
  const { address: addressId } = request.body as UpdateOrderBodyType;

  return reply.status(200).send({
    message: 'Order updated successfully.',
    result: await updateOrderService(userId, orderId, addressId),
    success: true,
  });
}

export async function listAllOrders(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({
    message: 'All orders listed successfully.',
    result: await listAllOrdersService(),
    success: true,
  });
}

export async function updateAllOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: orderId } = request.params as GetOrderParamsType;
  const updateData = request.body as UpdateOrderStatusBodyType;

  return reply.status(200).send({
    message: 'Order status updated successfully.',
    result: await updateAllOrdersService(orderId, updateData),
    success: true,
  });
}
