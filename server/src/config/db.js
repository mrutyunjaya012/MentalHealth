import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Copy server/.env.example to server/.env and add your Atlas connection string."
    );
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    if (error.message.includes("bad auth")) {
      throw new Error(
        "MongoDB authentication failed. Reset your Atlas database user password (Database Access) and update MONGODB_URI in server/.env"
      );
    }
    throw error;
  }
}

