import type {
  Multipart,
  MultipartFile,
  MultipartValue,
} from '@fastify/multipart';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createProductBodySchema } from '../schemas/routes-schemas/product-route-schema.ts';
import type {
  FastifyRequestBody,
  ProcessedFile,
} from '../types/global-types.ts';
import {
  validateImageMaximumCount,
  validateImageMinimumCount,
  validateImageSize,
} from '../utils/upload-validator.ts';

async function handleFilePart(part: MultipartFile): Promise<ProcessedFile> {
  const buffer = await validateImageSize(part);
  return {
    type: part.type as 'file',
    fieldname: part.fieldname,
    filename: part.filename,
    encoding: part.encoding,
    mimetype: part.mimetype,
    buffer,
  };
}

function handleFieldPart(
  part: MultipartValue,
  rawBody: Record<string, string | string[]>
) {
  if (rawBody[part.fieldname]) {
    if (Array.isArray(rawBody[part.fieldname])) {
      (rawBody[part.fieldname] as string[]).push(part.value as string);
    } else {
      rawBody[part.fieldname] = [
        rawBody[part.fieldname] as string,

        part.value as string,
      ];
    }
  } else {
    rawBody[part.fieldname] = part.value as string;
  }
}

async function parseMultipartFieldsAndFiles(request: FastifyRequestBody) {
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

export async function preHandlerProduct(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const customRequest = request as FastifyRequestBody;
  const { rawBody, images } = await parseMultipartFieldsAndFiles(customRequest);
  const validatedData = convertAndValidateFields(rawBody);

  customRequest.productData = validatedData;
  customRequest.images = images;
}
