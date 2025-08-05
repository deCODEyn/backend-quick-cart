import { ProductModel } from '../models/product-model.ts';
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
) {
  const imageUrls = await uploadImagesToCloudinary(images);
  const productToSave: ProductType = { ...productData, image: imageUrls };

  const newProduct = new ProductModel(productToSave);
  await newProduct.save();

  return {
    message: 'Product created and images uploaded successfully.',
    newProduct,
  };
}

export async function listProductsService() {
  return await ProductModel.find({});
}

export async function deleteProductService(id: string) {
  const product = await findProductOrThrow(id);

  if (product.image) {
    await deleteImagesFromCloudinary(product.image);
  }

  await ProductModel.findByIdAndDelete(id);
  return { message: 'Product and associated images deleted successfully.' };
}

export async function getProductService(id: string) {
  return await findProductOrThrow(id);
}

export async function updateProductService(
  id: string,
  updateData: UpdateProductBodyType
) {
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct) {
    throw new NotFoundError('Product not found after update.');
  }

  return {
    message: 'Product updated successfully.',
    updatedProduct,
  };
}
