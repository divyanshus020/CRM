import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
    description: "Auto-generated string in short numeric form (e.g., 'CUST001')",
  },
  userName: {
    type: String,
  },
  firmName: {
    type: String,
  },
  firmAddress: {
    type: String,
  },
  phone: {
    type: String,
  },
  alternativePhone: {
    type: String,
  },
  email: {
    type: String,
  },
  gst: {
    type: String,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
