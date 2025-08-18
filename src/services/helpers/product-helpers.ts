import type { Types } from 'mongoose';
import {
  type ProductDocumentInterface,
  ProductModel,
} from '../../models/product-model.ts';
import type { ValidSizeLiterals } from '../../schemas/utils.ts';
import type { ProductValidationItem } from '../../types/product-types.ts';
import { BadRequestError, NotFoundError } from '../../utils/errors.ts';

export async function findProductOrThrow(productId: Types.ObjectId) {
  const product = await ProductModel.findById(productId).exec();
  if (!product) {
    throw new NotFoundError('Product not found.');
  }
  return product;
}

export async function findAndValidateProducts(
  items: ProductValidationItem[]
): Promise<ProductDocumentInterface[]> {
  const productPromises = items.map((item) => findProductOrThrow(item.id));
  const foundProducts = await Promise.all(productPromises);
  const products: ProductDocumentInterface[] = [];
  const errors: string[] = [];

  for (const [i, product] of foundProducts.entries()) {
    if (!product) {
      errors.push(`Product with ID ${items[i].id} not found.`);
    } else if (product.sizes.includes(items[i].size as ValidSizeLiterals)) {
      products.push(product);
    } else {
      errors.push(
        `Size '${items[i].size}' is not available for product '${product.name}'.`
      );
    }
  }

  if (errors.length > 0) {
    throw new BadRequestError(errors.join(', '));
  }

  return products;
}
