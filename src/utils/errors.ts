import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  message: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request.') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Data conflict.') {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 404);
  }
}

export class CloudinaryError extends AppError {
  constructor(message = 'Cloudinary service failed') {
    super(message, 500);
  }
}

export class DataIntegrityError extends AppError {
  constructor(message = 'Data integrity error') {
    super(message, 500);
  }
}

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ZodError) {
    const errorMessages = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return reply.status(400).send({
      message: 'Validation failed.',
      errors: errorMessages,
    });
  }

  if (error.validation) {
    const errors = error.validation.map((validationError) => {
      return {
        field: validationError.instancePath.substring(1),
        message: validationError.message,
      };
    });

    reply.status(400).send({
      message: 'Data validation failure.',
      errors,
    });
    return;
  }

  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      message: error.message,
    });
    return;
  }

  reply.log.error(error);
  reply.status(500).send({
    message: 'Internal server error.',
  });
};
