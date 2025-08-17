import z from 'zod';
import { addressSchema } from '../address-schema.ts';

export const postAddressBodySchema = addressSchema.omit({
  userId: true,
});
export type PostAddressBodyType = z.infer<typeof postAddressBodySchema>;

export const getAddressParamsSchema = z.object({
  id: z.string().min(1, 'Address ID is required.'),
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
