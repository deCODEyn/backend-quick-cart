import type { Multipart } from '@fastify/multipart';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createProductBodySchema } from '../schemas/routes-schemas/product-route-schema.ts';
import type {
  FastifyCreateProductBody,
  ProcessedFile,
} from '../types/global-types.ts';
import { BadRequestError } from '../utils/errors.ts';
import {
  validateImageMaximumCount,
  validateImageMinimumCount,
} from '../utils/upload-validator.ts';
import { handleFieldPart, handleFilePart } from './pre-handler-helper.ts';

async function parseMultipartFieldsAndFiles(request: FastifyCreateProductBody) {
  const rawBody: Record<string, string | string[]> = {};
  const imagePromises: Promise<ProcessedFile>[] = [];
  for await (const part of request.parts() as AsyncIterableIterator<Multipart>) {
    if (part.type === 'file') {
      validateImageMaximumCount(imagePromises.length);
      imagePromises.push(handleFilePart(part));
    } else if (part.type === 'field') {
      handleFieldPart(part, rawBody);
    }
  }
  const images = await Promise.all(imagePromises);
  validateImageMinimumCount(images.length);

  return { rawBody, images };
}

function convertAndValidateFields(rawBody: Record<string, string | string[]>) {
  const bodyToValidate: Record<string, unknown> = {};
  for (const key of Object.keys(rawBody)) {
    const value = rawBody[key as keyof typeof rawBody];
    if (key === 'price' && typeof value === 'string') {
      bodyToValidate[key] = Number(value);
    } else if (key === 'bestseller' && typeof value === 'string') {
      bodyToValidate[key] = value === 'true';
    } else if (key === 'sizes' && !Array.isArray(value)) {
      bodyToValidate[key] = [value];
    } else {
      bodyToValidate[key] = value;
    }
  }

  return createProductBodySchema.parse(bodyToValidate);
}

export async function preHandlerCreateProduct(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  if (!request.isMultipart()) {
    throw new BadRequestError('Request must be multipart/form-data.');
  }
  const customRequest = request as FastifyCreateProductBody;
  const { rawBody, images } = await parseMultipartFieldsAndFiles(customRequest);
  const validatedData = convertAndValidateFields(rawBody);

  customRequest.productData = validatedData;
  customRequest.images = images;
}
