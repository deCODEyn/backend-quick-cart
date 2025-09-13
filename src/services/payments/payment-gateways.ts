import type { CreateOrderBodyType } from '../../schemas/routes-schemas/order-route-schema.ts';
import { getPaymentRazorpay } from '../external-services/razorpay.ts';
import { getPaymentStripe } from '../external-services/stripe.ts';

export const createGateway: Record<
  string,
  (orderData: CreateOrderBodyType) => Promise<unknown>
> = {
  stripe: async (orderData) => getPaymentStripe(orderData),
  razorpay: async (orderData) => getPaymentRazorpay(orderData),
  cod: async (_orderData) => null,
};
