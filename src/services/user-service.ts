import type { Types } from 'mongoose';
import { type UserDocumentInterface, userModel } from '../models/user-model.ts';
import type { updateUserProfileType } from '../schemas/routes-schemas/user-route-schema.ts';
import {
  type UserPublicType,
  type UserType,
  userPublicSchema,
} from '../schemas/user-schema.ts';
import type { ProcessedFile } from '../types/global-types.ts';
import { NotFoundError } from '../utils/errors.ts';
import { signToken } from '../utils/jwt.ts';
import {
  deleteImagesFromCloudinary,
  uploadImagesToCloudinary,
} from './external-services/cloudinary-service.ts';
import { findUserById, verifyPassword } from './helpers/user-helpers.ts';

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
  if (!(await verifyPassword(user, passwordFromRequest, false))) {
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
export async function updateUserProfileService(
  userId: Types.ObjectId,
  updateData: updateUserProfileType
): Promise<UserDocumentInterface> {
  const user = await findUserById(userId, true);
  const { currentPassword, ...dataToUpdate } = updateData;
  await verifyPassword(user, currentPassword);
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: userId },
    { $set: dataToUpdate },
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    throw new NotFoundError('User not found.');
  }

  return updatedUser;
}

export async function getMeService(
  userId: Types.ObjectId
): Promise<UserPublicType> {
  const user = await findUserById(userId);
  const userObject = user.toObject();
  const publicUser = userPublicSchema.parse({
    ...userObject,
    _id: userObject._id.toString(),
  });

  return publicUser;
}

export async function changePasswordService(
  userId: Types.ObjectId,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await findUserById(userId, true);
  await verifyPassword(user, currentPassword);
  user.password = newPassword;
  await user.save();

  return;
}
