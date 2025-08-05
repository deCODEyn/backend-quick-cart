import type { FastifyRequest } from 'fastify';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';

export interface FastifyRequestBody extends FastifyRequest {
  productData: CreateProductBodyType;
  images: ProcessedFile[];
}

export type ProcessedFile = {
  type: 'file';
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
};
