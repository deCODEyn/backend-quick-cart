import type { FastifyInstance } from 'fastify';
import { connectDB } from '../config/mongodb.ts'; // Importe sua função atual

export async function dbPlugin(app: FastifyInstance) {
  await connectDB(app);
}
