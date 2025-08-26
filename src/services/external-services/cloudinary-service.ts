import { v2 as cloudinary } from 'cloudinary';
import type { ProcessedFile } from '../../types/global-types.ts';
import { CloudinaryError, DataIntegrityError } from '../../utils/errors.ts';

export async function uploadImagesToCloudinary(
  images: ProcessedFile[],
  folder: string
): Promise<string[]> {
  const imageUrls = await Promise.all(
    images.map(async (image) => {
      const buffer = image.buffer;
      const base64 = buffer.toString('base64');
      const dataUri = `data:${image.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
      });
      return result.secure_url;
    })
  );
  if (!imageUrls) {
    throw new CloudinaryError('Failed to upload image to Cloudinary.');
  }

  return imageUrls;
}

export async function deleteImagesFromCloudinary(imageUrls: string[]) {
  try {
    const publicIds = imageUrls.map((url) => {
      const parts = url.split('/');
      const filenameWithExtension = parts.at(-1);
      const folder = parts.at(-2);
      if (!(filenameWithExtension && folder)) {
        throw new Error(`Invalid Cloudinary URL format for URL: ${url}.`);
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
