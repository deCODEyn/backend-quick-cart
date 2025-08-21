import z from 'zod';
import {
  VALID_ORDER_STATUSES_ENUM,
  VALID_SIZES_ENUM,
} from '../config/constants.ts';
import { minimizeAddressSchema } from './address-schema.ts';
import { objectIdSchema } from './zod-schema-utils.ts';

export const orderProductSchema = z.object({
  id: objectIdSchema,
  name: z.string().min(1, 'Product name is required.'),
  price: z.number().positive('Price must be a positive number.'),
  image: z.string().nonempty('Image is required'),
});
export type OrderProductType = z.infer<typeof orderProductSchema>;

export const orderItemSchema = z.object({
  product: orderProductSchema,
  quantity: z
    .number()
    .int('Quantity must be an integer.')
    .positive('Quantity must be a positive number.'),
  size: z.enum(VALID_SIZES_ENUM),
});
export type OrderItemType = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  address: minimizeAddressSchema,
  amount: z.number().positive('Amount must be a positive number.'),
  items: z
    .array(orderItemSchema)
    .min(1, 'The order must contain at least one item.'),
  deliveryFee: z
    .number()
    .nonnegative('Delivery fee must be a non-negative number.'),
  payment: z.boolean().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  status: z.enum(VALID_ORDER_STATUSES_ENUM).optional(),
  userId: objectIdSchema,
});
export type OrderType = z.infer<typeof orderSchema>;
