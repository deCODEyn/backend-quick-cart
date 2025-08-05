import { v2 as cloudinary } from 'cloudinary';
import { ProductModel } from '../models/product-model.ts';
import type { ProductType } from '../schemas/product-schema.ts';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';
import {
  CloudinaryError,
  DataIntegrityError,
  NotFoundError,
} from '../utils/errors.ts';

export async function createProductService(
  productData: CreateProductBodyType,
  images: ProcessedFile[]
) {
  const imageUrls = await Promise.all(
    images.map(async (image) => {
      const buffer = image.buffer;
      const base64 = buffer.toString('base64');
      const dataUri = `data:${image.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'products',
      });

      return result.secure_url;
    })
  );

  const productToSave: ProductType = { ...productData, image: imageUrls };

  const newProduct = new ProductModel(productToSave);
  await newProduct.save();

  return {
    message: 'Product created and images uploaded successfully.',
    newProduct,
  };
}

export async function listProductsService() {
  const products = await ProductModel.find({});

  return products;
}

async function deleteImagesFromCloudinary(imageUrls: string[]) {
  try {
    const publicIds = imageUrls.map((url) => {
      const parts = url.split('/');
      const filenameWithExtension = parts.at(-1);
      const folder = parts.at(-2);

      if (!(filenameWithExtension && folder)) {
        throw new Error(`Invalid Cloudinary URL format for URL: ${url}`);
      }
      const filename = filenameWithExtension.split('.')[0];

      return `${folder}/${filename}`;
    });

    await Promise.all(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Invalid Cloudinary URL')
    ) {
      throw new DataIntegrityError(error.message);
    }

    throw new CloudinaryError('Failed to delete images from Cloudinary.');
  }
}

export async function deleteProductService(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found.');
  }
  if (product.image) {
    await deleteImagesFromCloudinary(product.image);
  }

  await ProductModel.findByIdAndDelete(id);

  return { message: 'Product and associated images deleted successfully.' };
}

export async function getProductService(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  return product;
} 