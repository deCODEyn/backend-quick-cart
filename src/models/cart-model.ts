import mongoose, { type Document, type Model, type Types } from 'mongoose';
import { VALID_SIZES_ENUM } from '../config/constants.ts';
import type { CartType } from '../schemas/cart-schema.ts';

export interface CartDocumentInterface extends CartType, Document {
  _id: Types.ObjectId;
}
export interface CartModelInterface extends Model<CartDocumentInterface> {}

const CartDBSchema = new mongoose.Schema<
  CartDocumentInterface,
  CartModelInterface
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          size: { type: String, required: true, enum: VALID_SIZES_ENUM },
          quantity: { type: Number, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const CartModel =
  (mongoose.models.Cart as CartModelInterface) ||
  mongoose.model<CartDocumentInterface, CartModelInterface>(
    'Cart',
    CartDBSchema
  );
