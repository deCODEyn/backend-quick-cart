import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { connectCloudinary } from './config/cloudinary.ts';
import { MAX_FILE_SIZE } from './config/constants.ts';
import { connectDB } from './config/mongodb.ts';
import { env } from './env.ts';
import { cartRoute } from './routes/cart-route.ts';
import { productRoute } from './routes/product-route.ts';
import { userRoute } from './routes/user-route.ts';
import { errorHandler } from './utils/errors.ts';

const app = fastify({
  logger: { level: 'info' },
  disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  exposedHeaders: ['x-access-token'],
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.get('/api/health', () => {
  return 'Health check API: response OK';
});

app.register(userRoute);
app.register(productRoute);
app.register(cartRoute);

async function start() {
  try {
    await connectDB(app);
    connectCloudinary();

    await app.listen({ port: env.PORT });
    app.log.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
