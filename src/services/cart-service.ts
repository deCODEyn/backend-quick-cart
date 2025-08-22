import type { Types } from 'mongoose';
import { type CartDocumentInterface, CartModel } from '../models/cart-model.ts';
import type { UpdateCartItemResult } from '../types/cart-types.ts';

export async function clearCartService(
  userId: Types.ObjectId
): Promise<CartDocumentInterface | null> {
  return await CartModel.findOneAndDelete({ userId }).exec();
}

export async function removeCartItemService(
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
  size: string
): Promise<CartDocumentInterface | null> {
  const updatedCart = await CartModel.findOneAndUpdate(
    { userId },
    { $pull: { items: { id: itemId, size } } },
    { new: true }
  ).exec();
  if (updatedCart?.items.length === 0) {
    return await clearCartService(userId);
  }

  return updatedCart;
}

export async function updateExistingCartItemService(
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
  size: string,
  quantity: number
): Promise<CartDocumentInterface | null> {
  const updatedCart = await CartModel.findOneAndUpdate(
    { userId },
    { $set: { 'items.$[elem].quantity': quantity } },
    { new: true, arrayFilters: [{ 'elem.id': itemId, 'elem.size': size }] }
  ).exec();

  return updatedCart;
}

export async function addNewCartItemService(
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
  size: string,
  quantity: number
): Promise<CartDocumentInterface | null> {
  const newCart = await CartModel.findOneAndUpdate(
    { userId },
    { $push: { items: { id: itemId, size, quantity } } },
    { new: true, upsert: true }
  ).exec();

  return newCart;
}

export async function updateCartItemService(
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
  size: string,
  quantity: number
): Promise<UpdateCartItemResult> {
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
  if (
    updatedCart?.items.some(
      (item) => item.id.equals(itemId) && item.size === size
    )
  ) {
    return { cart: updatedCart, action: 'updated' };
  }

  return {
    cart: await addNewCartItemService(userId, itemId, size, quantity),
    action: 'added',
  };
}

export async function getCartItemsService(
  userId: Types.ObjectId
): Promise<CartDocumentInterface | null> {
  return await CartModel.findOne({ userId });
}
