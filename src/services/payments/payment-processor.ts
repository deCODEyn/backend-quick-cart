import type { CreateOrderBodyType } from '../../schemas/routes-schemas/order-route-schema.ts';
import { UnsupportedPaymentMethodError } from '../../utils/errors.ts';
import { createGateway } from './payment-gateways.ts';

export async function processPayment(
  orderData: CreateOrderBodyType,
  method: string
) {
  const gatewayFn = createGateway[method];
  if (!gatewayFn) {
    throw new UnsupportedPaymentMethodError(
      `Unsupported payment method: ${method}`
    );
  }
  await gatewayFn(orderData);

  return;
}
