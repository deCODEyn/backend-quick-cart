import z from 'zod';
import { ADDRESS_TYPE_ENUM, POSTAL_CODE_REGEX } from '../config/constants.ts';
import { objectIdSchema } from './utils.ts';

export const addressSchema = z.object({
  city: z.string().nonempty('City is required.'),
  complement: z.string().optional(),
  country: z.string().nonempty('Country is required.'),
  houseNumber: z.string().nonempty('House number is required.'),
  neighborhood: z.string().optional(),
  reference: z.string().optional(),
  state: z.string().nonempty('State is required.'),
  street: z.string().nonempty('Street is required.'),
  type: z.enum(ADDRESS_TYPE_ENUM).default('Home'),
  userId: objectIdSchema,
  zipCode: z
    .string()
    .nonempty('Zip code is required.')
    .regex(POSTAL_CODE_REGEX, 'Invalid zip code format.'),
});

export type AddressType = z.infer<typeof addressSchema>;

export const minimizeAddressSchema = addressSchema
  .pick({
    city: true,
    country: true,
    houseNumber: true,
    state: true,
    street: true,
    zipCode: true,
  })
  .extend({
    addressId: objectIdSchema,
  });
export type MinimizeAddressType = z.infer<typeof minimizeAddressSchema>;
