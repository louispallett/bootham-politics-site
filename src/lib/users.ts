import { connectToDB } from "./db";
import HttpError from "./HttpError";
import { UserType } from "./types";
import User from "@/models/User";

export async function getUserById(userId: string): Promise<UserType> {
  await connectToDB();

  const user = await User.findById(userId);

  if (!user) throw new HttpError("User not found", 404);

  return user;
}
