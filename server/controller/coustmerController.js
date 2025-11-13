import { supabase } from "../config/supabaseClient.js";

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
    const { data: existing, error: checkError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .eq('userName', userName)
      .eq('firmName', firmName)
      .single();

    if (existing) return res.status(409).json({ message: "Customer already exists" });

    // Get latest customer ID
    const { data: latestCustomer, error: latestError } = await supabase
      .from('customers')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();


    let newNumber = 1;
    if (latestCustomer && latestCustomer.id) {
      const number = parseInt(latestCustomer.id.replace("CUST", ""), 10);
      if (!isNaN(number)) newNumber = number + 1;
    }
    const id = `CUST${newNumber.toString().padStart(3, "0")}`;

    // Save new customer using Supabase
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert([{
        id,
        userName,
        firmName,
        firmAddress,
        phone,
        alternativePhone,
        email,
        gst,
        description,
        createdBy: req.id
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    return res.status(201).json({
      message: "Customer created successfully",
      data: newCustomer,
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
    const { id } = req.params;
    const updates = req.body;

    if (!req.id) return res.status(401).json({ message: "Please login" });

    // Basic validations
    if (updates.phone) {
      const phoneRegex = /^[0-9+\- ]{10,15}$/;
      if (!phoneRegex.test(updates.phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
    }

    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
    }

    if (updates.gst) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(updates.gst)) {
        return res.status(400).json({ message: "Invalid GSTIN" });
      }
    }

    // Update customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .single();

    if (updateError) throw updateError;
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully", customer: updatedCustomer });
  } catch (error) {
    console.error("Edit customer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    if (!req.id) return res.status(401).json({ message: "Please login" });

    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return res.status(200).json({ 
      message: "Customers fetched successfully", 
      data: customers, 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to fetch customers", 
      error: error.message,
      success: false 
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.id) return res.status(401).json({ message: "Please login" });

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ 
      message: "Customer deleted successfully", 
      success: true 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to delete customer", 
      error: error.message,
      success: false 
    });
  }
};


