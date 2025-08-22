import type { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { env } from '../env.ts';

export async function connectDB(app: FastifyInstance) {
  try {
    mongoose.connection.on('connected', () => {
      app.log.info('DB Connected');
    });
    await mongoose.connect(`${env.MONGODB_URI}/quickcart`);
  } catch (error) {
    app.log.error(error, 'DB connect error');
    process.exit(1);
  }
}
