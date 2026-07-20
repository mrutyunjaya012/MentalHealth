import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";

try {
  await connectDB();
  console.log("Database connection test passed.");
} catch (error) {
  console.error("Database connection test failed:");
  console.error(error.message);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
