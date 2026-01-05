import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not set");
  }

  return mongoose.connect(MONGODB_URI);
}
