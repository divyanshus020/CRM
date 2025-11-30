import { Challan } from '../model/challanModel.js';

export const getAllChallans = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.id;

    console.log('Fetching all challans for user:', userId);

    // Debug: Check total challans in database
    const totalChallans = await Challan.countDocuments();
    console.log('Total challans in database:', totalChallans);

    // Fetch all challans with populated customer data
    const challans = await Challan.find({})
      .populate('customerId', 'name email phone gstNumber firmName address')
      .sort({ createdAt: -1 })
      .lean();

    console.log('Challans fetched:', challans.length);
    console.log('Challans data:', challans);

    return res.status(200).json({
      success: true,
      count: challans.length,
      data: challans,
      message: `Found ${challans.length} challan(s)`
    });

  } catch (err) {
    console.error('getAllChallans error:', err);
    return next(err);
  }
};

import Challan from '../models/Challan.js';

export const createChallan = async (req, res, next) => {
  try {
    console.log('=== RAW REQUEST BODY ===');
    console.log(JSON.stringify(req.body, null, 2));

    const { 
      challanNo, date, customerName, firmName, items, totalAmount,
      customerEmail, customerPhone, customerAddress, gstNumber, 
      gstin, pan, contact, receiverSign, eoe, issuedBy, poNumber, 
      poDate, vehicleNo, gstAmount, subTotal, gstPercentage
    } = req.body;

    // Log field validation
    console.log('Field validation:');
    console.log('- challanNo:', challanNo);
    console.log('- date:', date);
    console.log('- customerName:', customerName);
    console.log('- items:', Array.isArray(items) ? `${items.length} items` : 'Not array');
    console.log('- totalAmount:', totalAmount);

    // Map customer fields correctly (userName from Customer model)
    const challanData = {
      challanNo: challanNo || 'DRAFT',
      date: date ? new Date(date) : new Date(),
      customer: {
        name: customerName || '', // Frontend sends customerName, map to schema's customer.name
        address: customerAddress || '',
        gstin: gstNumber || gstin || ''
      },
      firmName: firmName || '',
      gstin: gstNumber || gstin || '',
      pan: pan || '',
      contact: contact || customerPhone || '',
      poNumber: poNumber || '',
      poDate: poDate ? new Date(poDate) : null,
      vehicleNo: vehicleNo || '',
      items: Array.isArray(items) ? items.filter(item => item.particulars) : [],
      totalAmount: Number(totalAmount) || 0,
      gstAmount: Number(gstAmount) || 0,
      subTotal: Number(subTotal) || 0,
      gstPercentage: Number(gstPercentage) || 0,
      eoe: Boolean(eoe),
      receiverSign: receiverSign || null,
      issuedBy: issuedBy || 'System'
    };

    console.log('✓ Creating challan with:', JSON.stringify(challanData, null, 2));

    const challan = await Challan.create(challanData);

    console.log('✓ Challan created:', challan._id);

    return res.status(201).json({ 
      success: true, 
      message: 'Challan created successfully',
      data: challan 
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Validation errors:', err.errors);
    
    return res.status(400).json({
      success: false,
      message: err.message || 'Failed to create challan',
      errors: err.errors || {}
    });
  }
};

export const getChallanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challan = await Challan.findById(id)
      .populate('customerId', 'name email phone gstNumber firmName address');

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: 'Challan not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: challan
    });
  } catch (err) {
    console.error('getChallanById error:', err);
    return next(err);
  }
};

export const deleteChallan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challan = await Challan.findByIdAndDelete(id);

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: 'Challan not found'
      });
    }

    console.log('Challan deleted:', id);

    return res.status(200).json({
      success: true,
      message: 'Challan deleted successfully',
      data: challan
    });
  } catch (err) {
    console.error('deleteChallan error:', err);
    return next(err);
  }
};