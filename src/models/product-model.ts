import { VALID_SIZES_ENUM } from '../config/constants.ts';
import type { ProductType } from '../schemas/product-schema.ts';

const productDBSchema = new mongoose.Schema<ProductType>(
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

export const ProductModel = (mongoose.models.Product ||
  mongoose.model<ProductType>(
    'Product',
    productDBSchema
  )) as mongoose.Model<ProductType>;
