import fastify, { type FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { errorHandler } from '../utils/errors.ts';
import { appPlugins } from './app-plugins.ts';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: { level: 'info' },
    disableRequestLogging: true,
  }).withTypeProvider<ZodTypeProvider>();

  // -- 1. CONFIGURAÇÕES DE COMPILADORES --
  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  // -- 2. MANIPULADOR DE ERROS --
  app.setErrorHandler(errorHandler);

  // -- 3. REGISTRO DE ROTAS E PLUGINS --
  await app.register(appPlugins);

  return app;
}
