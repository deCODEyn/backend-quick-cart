import {
  type ProductDocumentInterface,
  ProductModel,
} from '../models/product-model.ts';
import type { ProductType } from '../schemas/product-schema.ts';
import type {
  CreateProductBodyType,
  UpdateProductBodyType,
} from '../schemas/routes-schemas/product-route-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';
import { NotFoundError } from '../utils/errors.ts';
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from './cloudinary-service.ts';
import { findProductOrThrow } from './product-helpers.ts';

export async function createProductService(
  productData: CreateProductBodyType,
  images: ProcessedFile[]
): Promise<ProductDocumentInterface> {
  const imageUrls = await uploadImagesToCloudinary(images);
  const productToSave: ProductType = { ...productData, image: imageUrls };

  const newProduct = new ProductModel(productToSave);
  await newProduct.save();

  return newProduct;
}

export async function listProductsService(): Promise<
  ProductDocumentInterface[]
> {
  return await ProductModel.find({}).exec();
}

export async function deleteProductService(productId: string): Promise<void> {
  const product = await findProductOrThrow(productId);
  if (product.image) {
    await deleteImagesFromCloudinary(product.image);
  }

  await ProductModel.findByIdAndDelete(productId).exec();

  return;
}

export async function getProductService(
  productId: string
): Promise<ProductDocumentInterface> {
  return await findProductOrThrow(productId);
}

export async function updateProductService(
  productId: string,
  updateData: UpdateProductBodyType
): Promise<ProductDocumentInterface> {
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  if (!updatedProduct) {
    throw new NotFoundError('Product not found after update.');
  }
  return updatedProduct;
}
