import type { Types } from 'mongoose';
import { type CartDocumentInterface, CartModel } from '../models/cart-model.ts';
import type { PostCartBodyType } from '../schemas/routes-schemas/cart-route-schema.ts';
import type { UpdateCartItemResult } from '../types/global-types.ts';

export async function clearCartService(
  userId: Types.ObjectId
): Promise<CartDocumentInterface | null> {
  return await CartModel.findOneAndDelete({ userId });
}

export async function removeCartItemService(
  userId: Types.ObjectId,
  itemId: string,
  size: string
): Promise<CartDocumentInterface | null> {
  const updatedCart = await CartModel.findOneAndUpdate(
    { userId },
    { $pull: { items: { id: itemId, size } } },
    { new: true }
  );
  if (updatedCart && updatedCart.items.length === 0) {
    return await clearCartService(userId);
  }

  return updatedCart;
}

export async function updateExistingCartItemService(
  userId: Types.ObjectId,
  itemId: string,
  size: string,
  quantity: number
): Promise<CartDocumentInterface | null> {
  const updatedCart = await CartModel.findOneAndUpdate(
    {
      userId,
      'items.id': itemId,
      'items.size': size,
    },
    {
      $set: { 'items.$.quantity': quantity },
    },
    { new: true }
  );
  return updatedCart;
}

export async function addNewCartItemService(
  userId: Types.ObjectId,
  itemId: string,
  size: string,
  quantity: number
): Promise<CartDocumentInterface | null> {
  const newCart = await CartModel.findOneAndUpdate(
    { userId },
    { $push: { items: { id: itemId, size, quantity } } },
    { new: true, upsert: true }
  );
  return newCart;
}

export async function updateCartItemService(
  userId: Types.ObjectId,
  itemData: PostCartBodyType
): Promise<UpdateCartItemResult> {
  const { id: itemId, size, quantity } = itemData;
  if (quantity <= 0) {
    return {
      cart: await removeCartItemService(userId, itemId, size),
      action: 'removed',
    };
  }

  const updatedCart = await updateExistingCartItemService(
    userId,
    itemId,
    size,
    quantity
  );
  if (updatedCart) {
    return { cart: updatedCart, action: 'updated' };
  }

  return {
    cart: await addNewCartItemService(userId, itemId, size, quantity),
    action: 'added',
  };
}
