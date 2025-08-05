import { ProductModel } from '../models/product-model.ts';
import { NotFoundError } from '../utils/errors.ts';

export async function findProductOrThrow(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found.');
  }
  return product;
}
