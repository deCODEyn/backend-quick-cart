import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { connectCloudinary } from './config/cloudinary.ts';
import { connectDB } from './config/mongodb.ts';
import { env } from './env.ts';
import { userRoute } from './routes/user-route.ts';

const app = fastify({
  logger: {
    level: 'info',
  },
  disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/api/health', () => {
  return 'Health check API: response OK';
});

app.register(userRoute);

async function start() {
  try {
    await connectDB();
    connectCloudinary();
    await app.listen({ port: env.PORT });
    app.log.info(`Servidor rodando na porta ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
