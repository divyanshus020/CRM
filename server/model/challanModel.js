// models/Challan.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  hsnCode: { type: String,  },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  gstin: { type: String }
});

const challanSchema = new mongoose.Schema({
  challanNo: { type: String, required: true },
  date: { type: Date, required: true },
  firmName: { type: String, required: true },
  gstin: { type: String, required: true },
  pan: { type: String, required: true },
  contact: { type: String, required: true },

  customer: { type: customerSchema, required: true },

  poNumber: { type: String },
  poDate: { type: Date },
  vehicleNo: { type: String },

  items: { type: [itemSchema], required: true },
  totalAmount: { type: Number, required: true },

  eoe: { type: Boolean, default: false }, // End of Entry
  receiverSign: { type: String, default: null },
  issuedBy: { type: String, required: true }
}, {
  timestamps: true // adds createdAt and updatedAt
});

export const Challan = mongoose.model('Challan', challanSchema);