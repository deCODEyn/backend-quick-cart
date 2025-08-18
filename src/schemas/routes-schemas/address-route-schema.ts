import z from 'zod';
import { addressSchema } from '../address-schema.ts';
import { objectIdSchema } from '../utils.ts';

export const createAddressBodySchema = addressSchema.omit({ userId: true });
export type CreateAddressBodyType = z.infer<typeof createAddressBodySchema>;

export const getAddressParamsSchema = z.object({
  id: objectIdSchema,
});
export type GetAddressParamsType = z.infer<typeof getAddressParamsSchema>;

export const updateAddressBodySchema = addressSchema.partial().pick({
  complement: true,
  houseNumber: true,
  neighborhood: true,
  reference: true,
  street: true,
  type: true,
});
export type updateAddressBodyType = z.infer<typeof updateAddressBodySchema>;
