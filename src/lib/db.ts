import mongoose from "mongoose";

declare global {
  var _mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

let cached = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectToDB(uri?: string) {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = uri ?? process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
