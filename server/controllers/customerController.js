import { Customer } from '../model/customerModel.js';

// @desc    Create a new customer
// @route   POST /api/v1/customer/new-customer
// @access  Public
export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address, gstNumber, firmName, alternativePhone, description } = req.body;

    // Create customer with correct schema mapping
    const customer = await Customer.create({
      id: 'CUST-' + Date.now(),              // Auto-generate ID to satisfy unique constraint
      userName: name || 'New Customer',      // Map 'name' from req to 'userName' in schema
      firmName: firmName || '',
      firmAddress: address || '',            // Map 'address' from req to 'firmAddress' in schema
      phone: phone || '',
      alternativePhone: alternativePhone || '',
      email: email || '',
      gst: gstNumber || '',                  // Map 'gstNumber' from req to 'gst' in schema
      description: description || '',
      // createdBy field is not in the schema shown, but was in the code. Removing it if not in schema, or keeping if it's implicit. 
      // The viewed schema did NOT show createdBy. I will omit it to be safe, or check if I missed it.
      // Re-checking schema: it ends at line 34. No createdBy.
    });

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (err) {
    console.error('createCustomer error:', err);
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Error keyPattern:', err.keyPattern);
    return res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: err.message,
      details: err
    });
  }
};

// @desc    Get all customers
// @route   GET /api/v1/customer
// @access  Public
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).select('-__v');
    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (err) {
    console.error('getAllCustomers error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: err.message
    });
  }
};

// @desc    Get single customer
// @route   GET /api/v1/customer/:id
// @access  Public
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-__v');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update customer
// @route   PUT /api/v1/customer/:id
// @access  Public
export const updateCustomer = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Remove any null or undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: false }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/v1/customer/:id
// @access  Private
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
