import { userModel } from '../models/user-model.ts';
import type { UserPublicType, UserType } from '../schemas/user-schema.ts';
import { signToken } from '../utils/jwt.ts';

export async function findUserByEmail(email: string) {
  const user = await userModel.findOne({ email });
  return user;
}

export async function createUser(userData: UserType): Promise<UserPublicType> {
  const newUser = new userModel(userData);
  await newUser.save();

  const { _id, email, name } = newUser.toObject();

  return { id: _id.toString(), name, email };
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
