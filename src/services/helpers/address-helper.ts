import type { Types } from 'mongoose';
import { AddressModel } from '../../models/address-model.ts';
import { NotFoundError } from '../../utils/errors.ts';

export async function findAddressOrThrow(
  addressId: string,
  userId: Types.ObjectId
) {
  const address = await AddressModel.findById({
    _id: addressId,
    userId,
  }).exec();
  if (!address) {
    throw new NotFoundError('Address not found.');
  }
  return address;
}
