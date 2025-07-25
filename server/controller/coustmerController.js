import { Customer } from "../model/customerModel.js";




export const createCustomer = async (req, res) => {
  try {
    const {
      userName,
      firmName,
      firmAddress,
      phone,
      alternativePhone,
      email,
      gst,
      description,
    } = req.body;

    if (!req.id) return res.status(401).json({ message: "Please login" });

    // Basic validations
    const phoneRegex = /^[0-9+\- ]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!userName || !firmName || !firmAddress || !phone || !alternativePhone || !email || !gst || !description)
      return res.status(400).json({ message: "All fields are required" });

    if (!phoneRegex.test(phone) || !phoneRegex.test(alternativePhone))
      return res.status(400).json({ message: "Invalid phone number" });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email address" });

    if (!gstRegex.test(gst))
      return res.status(400).json({ message: "Invalid GSTIN" });

    // Check duplicate customer
    const existing = await Customer.findOne({ userName, firmName, firmAddress, email });
    if (existing)
      return res.status(409).json({ message: "Customer already exists" });

    // 🔥 Unique ID Generation (get max existing CUSTxxx)
    const latestCustomer = await Customer.findOne({ id: /^CUST\d+$/ })
      .sort({ createdAt: -1 })
      .lean();

      console.log('Latest Customer:', latestCustomer);


    let newNumber = 1;
    if (latestCustomer && latestCustomer.id) {
      const number = parseInt(latestCustomer.id.replace("CUST", ""), 10);
      if (!isNaN(number)) newNumber = number + 1;
    }
    const id = `CUST${newNumber.toString().padStart(3, "0")}`;

    // Save new customer
    const customer = new Customer({
      id,
      userName,
      firmName,
      firmAddress,
      phone,
      alternativePhone,
      email,
      gst,
      description,
    });

    const savedCustomer = await customer.save();

    return res.status(201).json({
      message: "Customer created successfully",
      data: savedCustomer,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to create customer",
      error: error.message,
      success: false,
    });
  }
};



export const editCustomer = async (req, res) => {
  try {

    // console.log(req.body)

    const customerId = req.params.id;
    
    console.log('Customer ID:', customerId);
    const {
      userName,
      firmName,
      firmAddress,
      phone,
      alternativePhone,
      email,
      gst,
      description,
    } = req.body;
    if (!req.id) return res.status(401).json({ message: "Please login" });
    // Validate required fields
    if (!userName || !firmName || !firmAddress || !phone || !alternativePhone || !email || !gst || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Validate phone numbers
    const phoneRegex = /^[0-9+\- ]{10,15}$/;

    if (!phoneRegex.test(phone) || !phoneRegex.test(alternativePhone)) {
      return res.status(400).json({ message: "Invalid phone or alternative phone number" });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }


    // Validate GST
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gst)) {
      return res.status(400).json({ message: "Invalid GSTIN" });
    }
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // Update customer details
    customer.userName = userName;
    customer.firmName = firmName;
    customer.firmAddress = firmAddress;
    customer.phone = phone;
    customer.alternativePhone = alternativePhone;
    customer.email = email;
    customer.gst = gst;
    customer.description = description;
    
    const updatedCustomer = await customer.save();
    return res.status(200).json({
      message: "Customer updated successfully",
      data: updatedCustomer,
      success: true,
    });
  }
  catch (error) {
    return res.status(500).json({ message: "Failed to update customer", error: error.message, success: false });
  }
}


export const getAllCustomers = async (req, res) => {
  try {

    if (!req.id) return res.status(401).json({ message: "Please login" });
    const Customers = await Customer.find({}).sort({ createdAt: 1 });
    
    return res.status(200).json(Customers);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch Customers", error: error.message });
  }
};

export const deleteCusomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    if (!req.id) return res.status(401).json({ message: "Please login" });

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    } 
    await Customer.findByIdAndDelete(customerId);
    return res.status(200).json({ message: "Customer deleted successfully", success: true });
  }
  catch (error) {
    return res.status(500).json({ message: "Failed to delete customer", error: error.message });
  }
}


