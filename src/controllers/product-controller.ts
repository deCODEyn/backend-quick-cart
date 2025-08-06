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
  updateProductService,
} from '../services/product-service.ts';
import type { FastifyRequestBody } from '../types/global-types.ts';

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const customRequest = request as FastifyRequestBody;
  const { productData, images } = customRequest;
  const result = await createProductService(productData, images);

  return reply.status(201).send({
    message: 'Product created and images uploaded successfully.',
    result,
  });
}

export async function listProducts(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.status(200).send({ products: await listProductsService() });
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id: productId } = request.params as GetProductParamsType;

  return reply
    .status(200)
    .send({ products: await getProductService(productId) });
}

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: productId } = request.params as GetProductParamsType;
  const updateData = request.body as UpdateProductBodyType;

  return reply.status(200).send({
    message: 'Product updated successfully.',
    updatedProduct: await updateProductService(productId, updateData),
  });
}

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: productId } = request.params as GetProductParamsType;
  await deleteProductService(productId);

  return reply
    .status(200)
    .send({ message: 'Product and associated images deleted successfully.' });
}
