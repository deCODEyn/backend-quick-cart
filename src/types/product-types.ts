import type { Types } from 'mongoose';

export interface ProductQueryItem {
  id: string | Types.ObjectId;
  quantity: number;
  size: string;
}
