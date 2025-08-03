import type { MultipartFile } from '@fastify/multipart';
import { v2 as cloudinary } from 'cloudinary';
import { MAX_PRODUCT_IMAGES } from '../config/upload.ts';
import { ProductModel } from '../models/product-model.ts';
import type { ProductType } from '../schemas/product-schema.ts';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';
import { BadRequestError } from '../utils/errors.ts';

export async function createProductService(
  productData: CreateProductBodyType,
  images: MultipartFile[]
) {
  if (images.length === 0) {
    throw new BadRequestError('At least one image is required.');
  }

  if (images.length > MAX_PRODUCT_IMAGES) {
    throw new BadRequestError(
      `You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`
    );
  }

  const imageUrls = await Promise.all(
    images.map(async (image) => {
      const buffer = await image.toBuffer();
      const base64 = buffer.toString('base64');
      const dataUri = `data:${image.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'products',
      });

      return result.secure_url;
    })
  );

  const productToSave: ProductType = { ...productData, image: imageUrls };
  const newProduct = await ProductModel.create(productToSave);

  return newProduct;
}
