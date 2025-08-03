import type { MultipartFile } from '@fastify/multipart';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { MAX_PRODUCT_IMAGES } from '../config/upload.ts';
import type {
  CreateProductRequest,
  GetProductParamsType,
  UpdateProductBodyType,
} from '../schemas/routes-schemas/product-route-schema.ts';
import { createProductService } from '../services/product-service.ts';

export async function createProduct(
  request: FastifyRequest<CreateProductRequest>,
  reply: FastifyReply
) {
  const productData = request.body;

  const images: MultipartFile[] = [];
  for (let i = 1; i <= MAX_PRODUCT_IMAGES; i++) {
    const file = productData[`images${i}`] as MultipartFile | undefined;
    if (file) {
      images.push(file);
    }
  }

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
