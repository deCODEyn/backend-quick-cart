import type { Types } from 'mongoose';
import {
  type OrderDocumentInterface,
  OrderModel,
} from '../models/order-model.ts';
import type {
  CreateOrderBodyType,
  UpdateOrderBodyType,
  UpdateOrderStatusBodyType,
} from '../schemas/routes-schemas/order-route-schema.ts';
import { BadRequestError, NotFoundError } from '../utils/errors.ts';
import { getAndMinimizeAddress } from './helpers/address-helper.ts';
import { findOrderOrThrow, formatOrderItems } from './helpers/order-helper.ts';

export async function createOrderService(
  userId: Types.ObjectId,
  orderData: CreateOrderBodyType
): Promise<OrderDocumentInterface> {
  const { addressId, items, paymentMethod } = orderData;

  const orderAddress = await getAndMinimizeAddress(addressId, userId);
  const { orderItems, totalAmount } = await formatOrderItems(items);

  const newOrder = new OrderModel({
    address: orderAddress,
    amount: totalAmount,
    items: orderItems,
    paymentMethod,
    userId,
  });
  const savedOrder = await newOrder.save();

  return savedOrder;
}

export async function listOrdersService(
  userId: Types.ObjectId
): Promise<OrderDocumentInterface[]> {
  return await OrderModel.find({ userId }).exec();
}

export async function getOrderService(
  userId: Types.ObjectId,
  orderId: string
): Promise<OrderDocumentInterface> {
  return await findOrderOrThrow(orderId, userId);
}

export async function updateOrderService(
  userId: Types.ObjectId,
  orderId: string,
  updateData: UpdateOrderBodyType
): Promise<OrderDocumentInterface> {
  const order = await findOrderOrThrow(orderId, userId);
  const allowedStatuses = ['Order Placed', 'Ready to ship'];
  if (!allowedStatuses.includes(order.status as string)) {
    throw new BadRequestError(
      `Cannot update order with status '${order.status}'. Only orders with status 'Order Placed' or 'Ready to ship' can be updated.`
    );
  }

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId, userId },
    updateData,
    { new: true, runValidators: true }
  ).exec();

  return updatedOrder as OrderDocumentInterface;
}

export async function listAllOrdersService(): Promise<
  OrderDocumentInterface[]
> {
  return await OrderModel.find({}).exec();
}

export async function updateAllOrdersService(
  orderId: string,
  updateData: UpdateOrderStatusBodyType
): Promise<OrderDocumentInterface> {
  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId },
    updateData,
    { new: true, runValidators: true }
  ).exec();

  if (!updatedOrder) {
    throw new NotFoundError('Order not found.');
  }

  return updatedOrder;
}
