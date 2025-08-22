import type { FastifyReply, FastifyRequest } from 'fastify';
import type {
  FastifyUserImageBody,
  ProcessedFile,
} from '../types/global-types.ts';
import { BadRequestError } from '../utils/errors.ts';
import { handleFilePart } from './pre-handler-helper.ts';

export async function preHandlerUserImage(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  if (!request.isMultipart()) {
    throw new BadRequestError('Request must be multipart/form-data.');
  }
  const customRequest = request as FastifyUserImageBody;
  const parts = customRequest.parts();
  let file: ProcessedFile | undefined;
  for await (const part of parts) {
    if (part.type === 'file') {
      file = await handleFilePart(part);
      break;
    }
  }
  if (!file) {
    throw new BadRequestError('No file uploaded.');
  }

  customRequest.profileImage = file;
}
