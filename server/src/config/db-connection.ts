import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongouri = process.env.MONGODB_URI;
    if (!mongouri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongouri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};
