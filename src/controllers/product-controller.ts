import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  GetProductParamsType,
  UpdateProductBodyType,
} from '../schemas/routes-schemas/product-route-schema.ts';
import { createProductService } from '../services/product-service.ts';
import type { FastifyRequestBody } from '../types/global-types.ts';

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const customRequest = request as FastifyRequestBody;
  const { productData, images } = customRequest;

  const result = await createProductService(productData, images);

  return reply.status(201).send({
    message: 'Product created and images uploaded successfully.',
    result,
  });
}

export function listProducts(_request: FastifyRequest, _reply: FastifyReply) {
  //get products
}

export function getProduct(
  _request: FastifyRequest<{ Params: GetProductParamsType }>,
  _reply: FastifyReply
) {
  //get product by id
}

export function updateProduct(
  _request: FastifyRequest<{
    Body: UpdateProductBodyType;
    Params: GetProductParamsType;
  }>,
  _reply: FastifyReply
) {
  //update product
}

export function deleteProduct(
  _request: FastifyRequest<{ Params: GetProductParamsType }>,
  _reply: FastifyReply
) {
  //remove product
}
