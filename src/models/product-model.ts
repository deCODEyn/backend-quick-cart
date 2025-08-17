import mongoose, { type Document, type Model } from 'mongoose';
import { VALID_SIZES_ENUM } from '../config/constants.ts';
import type { ProductType } from '../schemas/product-schema.ts';

export interface ProductDocumentInterface extends ProductType, Document {}
export interface ProductModelInterface
  extends Model<ProductDocumentInterface> {}

const productDBSchema = new mongoose.Schema<
  ProductDocumentInterface,
  ProductModelInterface
>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: [String], required: true },
    sizes: { type: [String], required: true, enum: VALID_SIZES_ENUM },
    subCategory: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProductModel =
  (mongoose.models.Product as ProductModelInterface) ||
  mongoose.model<ProductDocumentInterface, ProductModelInterface>(
    'Product',
    productDBSchema
  );
