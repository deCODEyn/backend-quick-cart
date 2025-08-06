import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import type { PostCartBodyType } from '../schemas/routes-schemas/cart-route-schema.ts';
import { updateCartItemService } from '../services/cart-service.ts';
import { NotFoundError } from '../utils/errors.ts';

export async function updateCartItem(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const payloadUserId = request.user?.userId;
  if (!payloadUserId) {
    throw new NotFoundError('User not found.');
  }

  const userId = new mongoose.Types.ObjectId(payloadUserId);
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

  return reply.status(200).send({ message, cart });
}
