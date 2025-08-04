/** biome-ignore-all lint/suspicious/noConsole: <dev> */
/** biome-ignore-all lint/correctness/noUnusedImports: <dev> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <dev> */
import { v2 as cloudinary } from 'cloudinary';
import { ProductModel } from '../models/product-model.ts';
import type { ProductType } from '../schemas/product-schema.ts';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';

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

  return newProduct;
}
