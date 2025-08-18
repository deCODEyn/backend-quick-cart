import type { Types } from 'mongoose';
import { OrderModel } from '../../models/order-model.ts';
import type { OrderItemType } from '../../schemas/order-schema.ts';
import type { CreateOrderItemBodyType } from '../../schemas/routes-schemas/order-route-schema.ts';
import { NotFoundError } from '../../utils/errors.ts';
import { findAndValidateProducts } from './product-helpers.ts';

export async function findOrderOrThrow(
  orderId: Types.ObjectId,
  userId: Types.ObjectId
) {
  const order = await OrderModel.findOne({ _id: orderId, userId }).exec();
  if (!order) {
    throw new NotFoundError('Order not found or does not belong to the user.');
  }
  return order;
}

export async function formatOrderItems(
  items: CreateOrderItemBodyType[]
): Promise<{ orderItems: OrderItemType[]; totalAmount: number }> {
  const products = await findAndValidateProducts(items);
  const itemMap = new Map(items.map((item) => [item.id.toString(), item]));

  const orderItems: OrderItemType[] = [];
  let totalAmount = 0;

  for (const product of products) {
    const item = itemMap.get(product._id.toString());
    if (item) {
      orderItems.push({
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
        },
        quantity: item.quantity,
        size: item.size,
      });

      totalAmount += product.price * item.quantity;
    }
  }

  return { orderItems, totalAmount };
}
