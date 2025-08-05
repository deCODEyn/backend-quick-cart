import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  GetProductParamsType,
  UpdateProductBodyType,
} from '../schemas/routes-schemas/product-route-schema.ts';
import {
  createProductService,
  deleteProductService,
  getProductService,
  listProductsService,
} from '../services/product-service.ts';
import type { FastifyRequestBody } from '../types/global-types.ts';

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customRequest = request as FastifyRequestBody;
  const { productData, images } = customRequest;

  const result = await createProductService(productData, images);

  return reply.status(201).send(result);
}

export async function listProducts(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({ products: await listProductsService() });
}

export async function getProduct(
  request: FastifyRequest<{ Params: GetProductParamsType }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  return reply.status(200).send({ products: await getProductService(id) });
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

export async function deleteProduct(
  request: FastifyRequest<{ Params: GetProductParamsType }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  return reply.status(200).send(await deleteProductService(id));
}
