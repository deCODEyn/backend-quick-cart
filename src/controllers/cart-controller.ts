import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import type {
  DeleteCartItemParamsType,
  PostCartBodyType,
} from '../schemas/routes-schemas/cart-route-schema.ts';
import {
  clearCartService,
  getCartItemsService,
  removeCartItemService,
  updateCartItemService,
} from '../services/cart-service.ts';
import { getUserId } from '../services/helpers/user-helpers.ts';

export async function updateCartItem(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  const { id, quantity, size } = request.body as PostCartBodyType;
  const itemId = new mongoose.Types.ObjectId(id);

  const { cart, action } = await updateCartItemService(
    userId,
    itemId,
    size,
    quantity
  );

  let message = '';
  let status = 200;
  switch (action) {
    case 'removed':
      message = 'Item successfully removed from cart.';
      break;
    case 'added':
      message = 'Item successfully added to cart.';
      status = 201;
      break;
    case 'updated':
      message = 'Cart item quantity updated.';
      break;
    default:
      message = 'Cart has been updated.';
  }

  return reply
    .status(status)
    .send({ message, result: cart?.items, success: true });
}

export async function getCartItems(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  const cart = await getCartItemsService(userId);

  reply.status(200).send({ result: cart?.items, success: true });
}

export async function deleteCartItem(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  const { id, size } = request.params as DeleteCartItemParamsType;
  const itemId = new mongoose.Types.ObjectId(id);

  const cart = await removeCartItemService(userId, itemId, size);

  return reply.status(200).send({
    message: 'Item successfully removed from cart.',
    result: cart?.items,
    success: true,
  });
}

export async function clearCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  await clearCartService(userId);

  return reply
    .status(200)
    .send({ message: 'Your cart has been discarded.', success: true });
}
