import type { Document, Model } from 'mongoose';
import mongoose, { type Types } from 'mongoose';
import { ADDRESS_TYPE_ENUM } from '../config/constants.ts';
import type { AddressType } from '../schemas/address-schema.ts';
import { cleanNumericString } from '../utils/cleaner.ts';

export interface AddressDocumentInterface extends AddressType, Document {
  _id: Types.ObjectId;
}
export interface AddressModelInterface
  extends Model<AddressDocumentInterface> {}

const addressDBSchema = new mongoose.Schema<
  AddressDocumentInterface,
  AddressModelInterface
>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    neighborhood: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    type: {
      type: String,
      enum: ADDRESS_TYPE_ENUM,
      default: 'Home',
    },
    complement: { type: String, required: false },
    reference: { type: String, required: false },
  },
  { timestamps: true }
);

addressDBSchema.pre('save', function (next) {
  if (this.isModified('zipCode') && this.zipCode) {
    this.zipCode = cleanNumericString(this.zipCode);
  }
  next();
});

export const AddressModel =
  (mongoose.models.Address as AddressModelInterface) ||
  mongoose.model<AddressDocumentInterface, AddressModelInterface>(
    'Address',
    addressDBSchema
  );
