import mongoose, { type Document, type Model, type Types } from 'mongoose';
import {
  VALID_ORDER_STATUSES_ENUM,
  VALID_SIZES_ENUM,
} from '../config/constants.ts';
import type { OrderType } from '../schemas/order-schema.ts';

export interface OrderDocumentInterface extends OrderType, Document {
  _id: Types.ObjectId;
}
export interface OrderModelInterface extends Model<OrderDocumentInterface> {}

const OrderDBSchema = new mongoose.Schema<
  OrderDocumentInterface,
  OrderModelInterface
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [
        {
          product: {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
          },
          quantity: { type: Number, required: true },
          size: { type: String, required: true, enum: VALID_SIZES_ENUM },
        },
      ],
      default: [],
    },
    amount: { type: Number, required: true },
    address: {
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
      },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    status: {
      type: String,
      required: true,
      enum: VALID_ORDER_STATUSES_ENUM,
      default: 'Order Placed',
    },
    deliveryFee: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const OrderModel =
  (mongoose.models.Order as OrderModelInterface) ||
  mongoose.model<OrderDocumentInterface, OrderModelInterface>(
    'Order',
    OrderDBSchema
  );
