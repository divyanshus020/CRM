import { Customer } from "../model/customerModel.js";


export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, gstin } = req.body;

    if (!req.id) return res.status(401).json({ message: "please login" });
    if (!name || !address)
      return res.status(400).json({ message: "Name and Address are required" });

    const phoneRegex = /^[6-9]\d{9}$/;
    console.log(phone, phoneRegex.test(phone));
    if (phone && !phoneRegex.test(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstin && !gstRegex.test(gstin))
      return res.status(400).json({ message: "Invalid GSTIN" });

    const existing = await Customer.findOne({ user: req.id, name, address });
    if (existing)
      return res.status(409).json({ message: "Customer already exists" });

    const customer = new Customer({ user: req.id, name, phone, address, gstin });
    const savedCustomer = await customer.save();

    return res.status(201).json(savedCustomer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create Customer", error: error.message });
  }
};


export const getAllCustomers = async (req, res) => {
  try {
    const Customers = await Customer.find({ user: req.id }).sort({ createdAt: -1 });
    return res.status(200).json(Customers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch Customers", error: error.message });
  }
};

