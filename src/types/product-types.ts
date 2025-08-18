import type { Types } from 'mongoose';

export interface ProductValidationItem {
  id: Types.ObjectId;
  quantity: number;
  size: string;
}
