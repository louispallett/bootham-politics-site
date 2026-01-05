import mongoose from "mongoose";

export async function connectToDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGODB_URI);
}
