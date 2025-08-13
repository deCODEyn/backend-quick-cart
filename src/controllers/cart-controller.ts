import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import type {
  DeleteCartItemParamsType,
  PostCartBodyType,
} from '../schemas/routes-schemas/cart-route-schema.ts';
import {
  clearCartService,
  removeCartItemService,
  updateCartItemService,
} from '../services/cart-service.ts';
import { getUserId } from '../services/helpers/user-helpers.ts';

export async function updateCartItem(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  const { cart, action } = await updateCartItemService(
    userId,
    request.body as PostCartBodyType
  );

  let message = '';
  switch (action) {
    case 'removed':
      message = 'Item successfully removed from cart.';
      break;
    case 'added':
      message = 'Item successfully added to cart.';
      break;
    case 'updated':
      message = 'Cart item quantity updated.';
      break;
    default:
      message = 'Cart has been updated.';
  }

  return reply.status(200).send({ message, result: cart, success: true });
}

export async function deleteCartItem(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: itemId, size } = request.params as DeleteCartItemParamsType;
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  await removeCartItemService(userId, itemId, size);

  return reply
    .status(200)
    .send({ message: 'Item successfully removed from cart.', success: true });
}

export async function clearCart(request: FastifyRequest, reply: FastifyReply) {
  const userId = new mongoose.Types.ObjectId(getUserId(request.user));
  await clearCartService(userId);

  return reply
    .status(200)
    .send({ message: 'Your cart has been discarded.', success: true });
}
