import mongoose from "mongoose";
import dotenv from "dotenv";

console.log("Connecting to MongoDB");
await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
});
console.log("Connected to MongoDB");
