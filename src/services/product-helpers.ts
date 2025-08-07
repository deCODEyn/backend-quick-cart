import { ProductModel } from '../models/product-model.ts';
import { NotFoundError } from '../utils/errors.ts';

export async function findProductOrThrow(productId: string) {
  const product = await ProductModel.findById(productId).exec();
  if (!product) {
    throw new NotFoundError('Product not found.');
  }
  return product;
}
