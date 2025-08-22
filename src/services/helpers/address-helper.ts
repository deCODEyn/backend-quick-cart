import type { Types } from 'mongoose';
import { AddressModel } from '../../models/address-model.ts';
import type { MinimizeAddressType } from '../../schemas/address-schema.ts';
import { NotFoundError } from '../../utils/errors.ts';

export async function findAddressOrThrow(
  addressId: Types.ObjectId,
  userId: Types.ObjectId
) {
  const address = await AddressModel.findOne({ _id: addressId, userId }).exec();
  if (!address) {
    throw new NotFoundError('Address not found.');
  }

  return address;
}

export async function getAndMinimizeAddress(
  addressId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<MinimizeAddressType> {
  const address = await findAddressOrThrow(addressId, userId);

  return {
    addressId: address._id,
    street: address.street,
    houseNumber: address.houseNumber,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
  };
}
