/** biome-ignore-all lint/suspicious/noConsole: Log from connection on Database */

import mongoose from 'mongoose';
import { env } from '../env.ts';

export async function connectDB() {
  try {
    mongoose.connection.on('connected', () => {
      console.log('DB Connected');
    });
    await mongoose.connect(`${env.MONGODB_URI}/quickcart`);
  } catch (error) {
    console.log('DB connect error:', error);
  }
}
