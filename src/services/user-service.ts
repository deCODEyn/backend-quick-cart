import { type UserDocumentInterface, userModel } from '../models/user-model.ts';
import type { UserType } from '../schemas/user-schema.ts';

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
