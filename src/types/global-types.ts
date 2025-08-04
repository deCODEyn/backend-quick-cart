import type { FastifyRequest } from 'fastify';
import type z from 'zod';
import type { createProductBodySchema } from '../schemas/routes-schemas/product-route-schema.ts';

export interface FastifyRequestBody extends FastifyRequest {
  productData: z.infer<typeof createProductBodySchema>;
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
