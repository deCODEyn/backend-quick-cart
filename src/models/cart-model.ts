import mongoose from 'mongoose';
import type { CartType } from '../schemas/cart-schema.ts';

const CartDBSchema = new mongoose.Schema<CartType>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: {
      type: [
        {
          id: { type: String, required: true },
          size: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

export const CartModel = (mongoose.models.Cart ||
  mongoose.model<CartType>('cart', CartDBSchema)) as mongoose.Model<CartType>;
