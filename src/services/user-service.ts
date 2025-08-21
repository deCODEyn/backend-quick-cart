import type { Types } from 'mongoose';
import { userModel } from '../models/user-model.ts';
import type { UserPublicType, UserType } from '../schemas/user-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';
import { signToken } from '../utils/jwt.ts';
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from './external-services/cloudinary-service.ts';
import { findUserById } from './helpers/user-helpers.ts';

export async function createUser(userData: UserType): Promise<UserPublicType> {
  const newUser = new userModel(userData);
  const savedUser = await newUser.save();
  const { _id, email, name, role } = savedUser;

  return { _id, name, email, role };
}

export async function authenticateUser(
  email: string,
  passwordFromRequest: string
): Promise<string | null> {
  const user = await userModel.findOne({ email }).select('+password').exec();
  if (!user) {
    return null;
  }
  const isMatch = await user.comparePassword(passwordFromRequest);
  if (!isMatch) {
    return null;
  }
  const token = signToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  return token;
}

export async function uploadUserImageService(
  userId: Types.ObjectId,
  profileImage: ProcessedFile
): Promise<string> {
  const user = await findUserById(userId);
  if (user.profileImage) {
    await deleteImagesFromCloudinary([user.profileImage]);
  }
  const [newImageUrl] = await uploadImagesToCloudinary(
    [profileImage],
    'user-profile'
  );
  user.profileImage = newImageUrl;
  await user.save();

  return newImageUrl;
}
