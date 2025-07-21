import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true },
});

const challanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    challanNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [itemSchema],
    subTotal: { type: Number, required: true },
    gstPercentage: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Challan = mongoose.model("Challan", challanSchema);
export const Item = mongoose.model("Item", itemSchema);
