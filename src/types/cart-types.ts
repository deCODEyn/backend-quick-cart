import type { CartDocumentInterface } from '../models/cart-model.ts';

export type UpdateCartItemResult = {
  cart: CartDocumentInterface | null;
  action: 'updated' | 'added' | 'removed';
};
