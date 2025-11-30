// models/Challan.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  particulars: { type: String },
  hsnCode: { type: String },
  quantity: { type: Number },
  rate: { type: Number },
  amount: { type: Number }
});

const customerSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  gstin: { type: String }
});

const challanSchema = new mongoose.Schema({
  challanNo: { type: String },
  date: { type: Date },
  firmName: { type: String },
  gstin: { type: String },
  pan: { type: String },
  contact: { type: String },

  customer: { type: customerSchema },

  poNumber: { type: String },
  poDate: { type: Date },
  vehicleNo: { type: String },

  items: { type: [itemSchema] },
  totalAmount: { type: Number },

  eoe: { type: Boolean, default: false }, // End of Entry
  receiverSign: { type: String, default: null },
  issuedBy: { type: String }
}, {
  timestamps: true // adds createdAt and updatedAt
});

export const Challan = mongoose.model('Challan', challanSchema);