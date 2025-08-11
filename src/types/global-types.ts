import type { FastifyRequest } from 'fastify';
import type z from 'zod';
import type { CartDocumentInterface } from '../models/cart-model.ts';
import type { CreateProductBodyType } from '../schemas/routes-schemas/product-route-schema.ts';
import type { jwtPayloadSchema } from '../schemas/utils.ts';

export interface FastifyRequestBody extends FastifyRequest {
  productData: CreateProductBodyType;
  images: ProcessedFile[];
}

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export type ProcessedFile = {
  type: 'file';
  fieldname: string;
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
};

export type UpdateCartItemResult = {
  cart: CartDocumentInterface | null;
  action: 'updated' | 'added' | 'removed';
};
