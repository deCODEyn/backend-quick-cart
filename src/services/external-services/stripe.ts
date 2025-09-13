import Stripe from 'stripe';
import { env } from '../../env.ts';
import type { CreateOrderBodyType } from '../../schemas/routes-schemas/order-route-schema.ts';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export function getPaymentStripe(_orderData: CreateOrderBodyType) {
  // noop
}
