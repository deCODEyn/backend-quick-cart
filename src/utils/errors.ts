import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

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

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
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
    message: 'Ocorreu um erro interno no servidor.',
  });
};
