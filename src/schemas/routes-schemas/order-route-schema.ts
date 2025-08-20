import z from 'zod';
import { VALID_SIZES_ENUM } from '../../config/constants.ts';
import { orderSchema } from '../order-schema.ts';
import { objectIdSchema } from '../utils.ts';

export const createOrderItemBodySchema = z.object({
  id: objectIdSchema,
  quantity: z
    .number()
    .int('Quantity must be an integer.')
    .positive('Quantity must be a positive number.'),
  size: z.enum(VALID_SIZES_ENUM),
});
export type CreateOrderItemBodyType = z.infer<typeof createOrderItemBodySchema>;

export const createOrderBodySchema = z.object({
  addressId: objectIdSchema,
  items: z
    .array(createOrderItemBodySchema)
    .min(1, 'The order must contain at least one item.'),
  deliveryFee: z
    .number()
    .nonnegative('Delivery fee must be a non-negative number.'),
  paymentMethod: z.string().min(1, 'Payment method is required.'),
});
export type CreateOrderBodyType = z.infer<typeof createOrderBodySchema>;

export const updateOrderBodySchema = z.object({
  address: objectIdSchema,
});
export type UpdateOrderBodyType = z.infer<typeof updateOrderBodySchema>;

export const updateOrderStatusBodySchema = orderSchema.partial().pick({
  status: true,
});
export type UpdateOrderStatusBodyType = z.infer<
  typeof updateOrderStatusBodySchema
>;

export const getOrderParamsSchema = z.object({
  id: objectIdSchema,
});
export type GetOrderParamsType = z.infer<typeof getOrderParamsSchema>;
