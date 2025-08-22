import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import type { FastifyInstance } from 'fastify';
import { MAX_FILE_SIZE } from '../config/constants.ts';
import { appRoutes } from './app-routes.ts';
import { cloudinaryPlugin } from './cloudinary-plugin.ts';
import { dbPlugin } from './db-plugin.ts';

export function appPlugins(app: FastifyInstance) {
  // -- 1. REGISTRO DE PLUGINS GLOBAIS --
  app.register(fastifyCookie);
  app.register(fastifyCors, {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  });

  // -- 2. REGISTRO DE PLUGINS ESPECÍFICOS --
  app.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

  // -- 3. REGISTRO DE PLUGINS DE DOCUMENTAÇÃO --

  // -- 4. REGISTRO DE SERVIÇOS E CONEXÕES --
  app.register(dbPlugin);
  app.register(cloudinaryPlugin);

  // -- 5. REGISTRO DAS ROTAS DA APLICAÇÃO --
  app.register(appRoutes);

  // -- 6. HEALTH CHECK --
  app.get('/api/health', () => {
    return 'Health check API: response OK';
  });
}
