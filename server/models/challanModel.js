import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  hsnCode: { type: String },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const customerSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  address: { type: String, default: '' },
  gstin: { type: String, default: '' }
});

const challanSchema = new mongoose.Schema({
  challanNo: { type: String, required: true },
  date: { type: Date, required: true },
  firmName: { type: String, default: '' },
  gstin: { type: String, default: '' },
  pan: { type: String, default: '' },
  contact: { type: String, default: '' },
  customer: { type: customerSchema, default: {} },
  poNumber: { type: String, default: '' },
  poDate: { type: Date },
  vehicleNo: { type: String, default: '' },
  items: { type: [itemSchema], default: [] },
  totalAmount: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  subTotal: { type: Number, default: 0 },
  gstPercentage: { type: Number, default: 0 },
  eoe: { type: Boolean, default: false },
  receiverSign: { type: String, default: null },
  issuedBy: { type: String, default: '' },
  narration: { type: String, default: '' }
}, {
  timestamps: true
});

const Challan = mongoose.model('Challan', challanSchema);
export default Challan;