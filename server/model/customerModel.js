import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    gstin: { type: String },
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
