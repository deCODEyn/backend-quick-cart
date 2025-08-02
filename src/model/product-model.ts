import mongoose from 'mongoose';
import type { ProductType } from '../schema/product-schema.ts';

const validSizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

const productDBSchema = new mongoose.Schema<ProductType>({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
    enum: validSizes,
  },
  subCategory: {
    type: String,
    required: true,
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
    required: true,
  },
});

export const ProductModel =
  mongoose.models.product ||
  mongoose.model<ProductType>('product', productDBSchema);
