import type { MultipartFile, MultipartValue } from '@fastify/multipart';
import type { ProcessedFile } from '../types/global-types.ts';
import { validateImageSize } from '../utils/upload-validator.ts';

export async function handleFilePart(
  part: MultipartFile
): Promise<ProcessedFile> {
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

export function handleFieldPart(
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
