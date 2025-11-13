import Customer from '../models/Customer.js';

// @desc    Create a new customer
// @route   POST /api/v1/customer/new-customer
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      gstNumber,
      // Add other customer fields as needed
    } = req.body;

    // Create new customer
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      gstNumber,
      createdBy: req.user.id,
    });

    const createdCustomer = await customer.save();
    
    res.status(201).json({
      success: true,
      data: createdCustomer,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all customers
// @route   GET /api/v1/customer
// @access  Private
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({});
    return res.status(200).json({ success: true, data: customers });
  } catch (err) {
    console.error('getAllCustomers error:', err);
    return next(err);
  }
};

// @desc    Get single customer
// @route   GET /api/v1/customer/:id
// @access  Private
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

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
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      gstNumber,
      // Add other customer fields as needed
    } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      {
        name,
        email,
        phone,
        address,
        gstNumber,
        // Update other fields as needed
      },
      { new: true, runValidators: true }
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
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

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
