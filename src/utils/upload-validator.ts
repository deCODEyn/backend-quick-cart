import type { MultipartFile } from '@fastify/multipart';
import { MAX_FILE_SIZE, MAX_PRODUCT_IMAGES } from '../config/upload.ts';
import { BadRequestError } from './errors.ts';

export function validateImageCount(imagesCount: number) {
  if (imagesCount >= MAX_PRODUCT_IMAGES) {
    throw new BadRequestError(
      `The ${MAX_PRODUCT_IMAGES} image limit has been exceeded.`
    );
  }
}

export function validateImageMinimumCount(imagesCount: number) {
  if (imagesCount === 0) {
    throw new BadRequestError('At least one image is required.');
  }
}

export async function validateImageSize(part: MultipartFile): Promise<Buffer> {
  const buffer = await part.toBuffer();
  if (buffer.length > MAX_FILE_SIZE) {
    throw new BadRequestError(
      `The maximum size per image is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    );
  }
  return buffer;
}
