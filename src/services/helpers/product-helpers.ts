import type { Types } from 'mongoose';
import {
  type ProductDocumentInterface,
  ProductModel,
} from '../../models/product-model.ts';
import type { ValidSizeLiterals } from '../../schemas/utils.ts';
import type { ProductQueryItem } from '../../types/product-types.ts';
import { BadRequestError, NotFoundError } from '../../utils/errors.ts';

export async function findProductOrThrow(productId: string | Types.ObjectId) {
  const product = await ProductModel.findById(productId).exec();
  if (!product) {
    throw new NotFoundError('Product not found.');
  }
  return product;
}

export async function findAndValidateProducts(
  items: ProductQueryItem[]
): Promise<ProductDocumentInterface[]> {
  const productPromises = items.map((item) => findProductOrThrow(item.id));
  const foundProducts = await Promise.all(productPromises);
  const products: ProductDocumentInterface[] = [];
  const errors: string[] = [];

  foundProducts.forEach((product, index) => {
    if (!product) {
      errors.push(`Product with ID ${items[index].id} not found.`);
    } else if (product.sizes.includes(items[index].size as ValidSizeLiterals)) {
      products.push(product);
    } else {
      errors.push(
        `Size '${items[index].size}' is not available for product '${product.name}'.`
      );
    }
  });

  if (errors.length > 0) {
    throw new BadRequestError(errors.join(', '));
  }

  return products;
}
