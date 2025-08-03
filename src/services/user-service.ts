import { type UserDocumentInterface, userModel } from '../models/user-model.ts';
import type { UserType } from '../schemas/user-schema.ts';
import { signToken } from '../utils/jwt.ts';

export async function findUserByEmail(email: string) {
  const user = await userModel.findOne({ email });
  return user;
}

export async function createUser(
  userData: UserType
): Promise<UserDocumentInterface> {
  const newUser = new userModel(userData);
  await newUser.save();

  return newUser;
}

export async function authenticateUser(
  email: string,
  passwordFromRequest: string
): Promise<string | null> {
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return null;
  }

  const isMatch = await user.comparePassword(passwordFromRequest);
  if (!isMatch) {
    return null;
  }

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
  });

  return token;
}
