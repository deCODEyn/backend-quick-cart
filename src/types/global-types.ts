import type { FastifyRequest } from 'fastify';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';

export interface FastifyCreateProductBody extends FastifyRequest {
  productData: CreateProductBodyType;
  images: ProcessedFile[];
}

export interface FastifyUserImageBody extends FastifyRequest {
  profileImage: ProcessedFile;
}

export type ProcessedFile = {
  type: 'file';
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
};
