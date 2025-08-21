import type { Types } from 'mongoose';
import {
  type ProductDocumentInterface,
  ProductModel,
} from '../models/product-model.ts';
import type {
  CreateProductBodyType,
  UpdateProductBodyType,
} from '../schemas/routes-schemas/product-route-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';
import { NotFoundError } from '../utils/errors.ts';
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from './external-services/cloudinary-service.ts';
import { findProductOrThrow } from './helpers/product-helpers.ts';

export async function createProductService(
  productData: CreateProductBodyType,
  images: ProcessedFile[]
): Promise<ProductDocumentInterface> {
  const imageUrls = await uploadImagesToCloudinary(images, 'products');

  const newProduct = new ProductModel({ ...productData, image: imageUrls });
  const savedProduct = await newProduct.save();

  return savedProduct;
}

export async function listProductsService(): Promise<
  ProductDocumentInterface[]
> {
  return await ProductModel.find({}).exec();
}

export async function deleteProductService(
  productId: Types.ObjectId
): Promise<void> {
  const deletedProduct = await ProductModel.findByIdAndDelete(productId).exec();
  if (!deletedProduct) {
    throw new NotFoundError('Product not found.');
  }
  if (deletedProduct.image) {
    await deleteImagesFromCloudinary(deletedProduct.image);
  }

  return;
}

export async function getProductService(
  productId: Types.ObjectId
): Promise<ProductDocumentInterface> {
  return await findProductOrThrow(productId);
}

export async function updateProductService(
  productId: Types.ObjectId,
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
    throw new NotFoundError('Product not found.');
  }

  return updatedProduct;
}
