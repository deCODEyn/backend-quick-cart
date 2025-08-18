import type { Types } from 'mongoose';
import {
  type AddressDocumentInterface,
  AddressModel,
} from '../models/address-model.ts';
import type {
  CreateAddressBodyType,
  updateAddressBodyType,
} from '../schemas/routes-schemas/address-route-schema.ts';
import { NotFoundError } from '../utils/errors.ts';
import { findAddressOrThrow } from './helpers/address-helper.ts';

export async function createAddressService(
  userId: Types.ObjectId,
  body: CreateAddressBodyType
): Promise<AddressDocumentInterface> {
  const newAddress = new AddressModel({ userId, ...body });
  await newAddress.save();

  return newAddress;
}

export async function listAddressesService(
  userId: Types.ObjectId
): Promise<AddressDocumentInterface[]> {
  return await AddressModel.find({ userId }).exec();
}

export async function getAddressService(
  addressId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<AddressDocumentInterface> {
  return await findAddressOrThrow(addressId, userId);
}

export async function updateAddressService(
  userId: Types.ObjectId,
  addressId: Types.ObjectId,
  updateData: updateAddressBodyType
): Promise<AddressDocumentInterface> {
  const updatedAddress = await AddressModel.findOneAndUpdate(
    {
      userId,
      _id: addressId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  if (!updatedAddress) {
    throw new NotFoundError('Address not found.');
  }

  return updatedAddress;
}

export async function deleteAddressService(
  userId: Types.ObjectId,
  addressId: Types.ObjectId
): Promise<void> {
  const deletedAddress = await AddressModel.findOneAndDelete({
    _id: addressId,
    userId,
  }).exec();
  if (!deletedAddress) {
    throw new NotFoundError(
      'Address not found or does not belong to the user.'
    );
  }

  return;
}
