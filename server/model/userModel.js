import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String },
    businessAddress: { type: String },
    businessGst: { type: String },
    // Add logo URL if you want to support image uploads
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema)
