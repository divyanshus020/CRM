import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    match: /^CUST\d{3,}$/,
    unique: true,
    description: "Auto-generated string in short numeric form (e.g., 'CUST001')",
  },
  userName: {
    type: String,
    required: true,
    minlength: 1,
  },
  firmName: {
    type: String,
    required: true,
    minlength: 1,
  },
  firmAddress: {
    type: String,
    required: true,
    minlength: 1,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9+\- ]{10,15}$/,
  },
  alternativePhone: {
    type: String,
    required: true,
    match: /^[0-9+\- ]{10,15}$/,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // email format regex
  },
  gst: {
    type: String,
    required: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
