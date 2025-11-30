import { Challan } from "../model/challanModel.js"; // adjust path as needed



export const createChallan = async (req, res) => {
  try {
    console.log('=== RAW REQUEST BODY ===');
    console.log(JSON.stringify(req.body, null, 2));

    const {
      challanNo,
      date,
      firmName,
      gstin,
      pan,
      contact,
      customer,
      customerName,
      customerAddress,
      gstNumber,
      poNumber,
      poDate,
      vehicleNo,
      items,
      issuedBy,
      totalAmount,
      gstAmount,
      subTotal,
      gstPercentage,
      eoe = false,
      receiverSign = null,
      narration = ''
    } = req.body;

    // Build customer object - handle both old format (customer object) and new format (separate fields)
    let customerObj = customer;
    if (!customerObj && customerName) {
      customerObj = {
        name: customerName,
        address: customerAddress || '',
        gstin: gstNumber || gstNumber || ''
      };
    }

    console.log('Field validation:');
    console.log('- challanNo:', challanNo, '| Empty?', !challanNo);
    console.log('- date:', date, '| Empty?', !date);
    console.log('- firmName:', firmName, '| Empty?', !firmName);
    console.log('- gstin:', gstin, '| Empty?', !gstin);
    console.log('- pan:', pan, '| Empty?', !pan);
    console.log('- contact:', contact, '| Empty?', !contact);
    console.log('- customer:', customerObj, '| Has name?', customerObj?.name, '| Has address?', customerObj?.address);
    console.log('- items:', items, '| Array?', Array.isArray(items), '| Length:', Array.isArray(items) ? items.length : 'N/A');
    console.log('- issuedBy:', issuedBy, '| Empty?', !issuedBy);
    console.log('- totalAmount:', totalAmount, '| Empty?', totalAmount === undefined || totalAmount === null);

    // Validation
    const errors = [];
    if (!challanNo) errors.push('challanNo is required');
    if (!date) errors.push('date is required');
    if (!firmName) errors.push('firmName is required');
    if (!gstin) errors.push('gstin is required');
    if (!pan) errors.push('pan is required');
    if (!contact) errors.push('contact is required');
    if (!customerObj || !customerObj.name || !customerObj.address) errors.push('customer with name and address is required');
    if (!Array.isArray(items) || items.length === 0) errors.push('items array is required and must not be empty');
    if (!issuedBy) errors.push('issuedBy is required');
    if (totalAmount === undefined || totalAmount === null || totalAmount === '') errors.push('totalAmount is required');

    if (errors.length > 0) {
      console.error('❌ Validation errors:', errors);
      console.error('Received data:', {
        challanNo,
        date,
        firmName,
        gstin,
        pan,
        contact,
        customerObj,
        itemsCount: Array.isArray(items) ? items.length : 0,
        issuedBy,
        totalAmount,
        allKeys: Object.keys(req.body)
      });
      return res.status(400).json({ 
        success: false,
        message: "Required fields are missing",
        errors: errors,
        receivedFields: {
          challanNo,
          date,
          firmName,
          gstin,
          pan,
          contact,
          customerObj,
          itemsCount: Array.isArray(items) ? items.length : 0,
          issuedBy,
          totalAmount
        }
      });
    }

    // Calculate amount per item if not already calculated
    const calculatedItems = items.map(item => {
      const amount = item.amount || (item.quantity * item.rate);
      return { ...item, amount };
    });

    console.log('Creating challan with data:', {
      challanNo,
      date,
      firmName,
      gstin,
      pan,
      contact,
      customer: customerObj,
      poNumber,
      poDate,
      vehicleNo,
      itemsCount: calculatedItems.length,
      totalAmount,
      eoe,
      receiverSign,
      issuedBy,
      narration
    });

    // Create Challan
    const newChallan = await Challan.create({
      challanNo,
      date: date ? new Date(date) : new Date(),
      firmName,
      gstin,
      pan,
      contact,
      customer: customerObj,
      poNumber,
      poDate: poDate ? new Date(poDate) : null,
      vehicleNo,
      items: calculatedItems,
      totalAmount: Number(totalAmount) || 0,
      eoe: Boolean(eoe),
      receiverSign: receiverSign || null,
      issuedBy
    });

    console.log('✓ Challan created successfully:', newChallan._id);

    return res.status(201).json({
      success: true,
      message: "Challan created successfully",
      data: newChallan
    });
  } catch (error) {
    console.error("Create Challan Error:", error);
    console.error("Error message:", error.message);
    console.error("Error details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create challan",
      error: error.message
    });
  }
};


export const getAllChallans = async (req, res) => {
  try {
    console.log("Fetching all challans for user:", req.id);
    const challans = await Challan.find({}).sort({ createdAt: -1 }).populate('customer');
    console.log(challans)
    return res.status(200).json(challans);
  } catch (error) {
    console.error("Get All Challans Error:", error); 
    return res.status(500).json({
      success: false,
      message: "Failed to fetch challans",
      error: error.message
    });
  }
}

export const getChallanByID = async(req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching challan with ID:", id);
    const challan = await Challan.findById(id).populate('customer');
    
    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    return res.status(200).json(challan);
  } catch (error) {
    console.error("Get Challan By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan",
      error: error.message
    });
  }
}


export const updateChallan = async (req, res) => {
  try {
    const challanId = req.params.id;
    const {
      customer,
      challanNumber,
      date,
      items,
      gstPercentage
    } = req.body;

    // Calculate totals from items

    let calculatedItems = [];
    
    if(items && items.length >0){
     calculatedItems = items.map(item => {
        const total = item.quantity * item.rate;
        return { ...item, total };
      });
    }

    const subTotal = calculatedItems.reduce((acc, item) => acc + item.total, 0);
    const gstAmount = (subTotal * gstPercentage) / 100;
    const grandTotal = subTotal + gstAmount;

    const updatedChallan = await Challan.findByIdAndUpdate(
      challanId,
      {
        customer,
        challanNumber,
        date,
        items: calculatedItems,
        subTotal,
        gstPercentage,
        gstAmount,
        grandTotal,
      },
      { new: true } // return updated document
    );

    if (!updatedChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    res.status(200).json(updatedChallan);
  } catch (error) {
    console.error("Error updating challan:", error);
    res.status(500).json({ message: "Server error while updating challan" });
  }
};


import mongoose from "mongoose";
// ...existing code...

export const deleteChallan = async (req, res) => {
  try {
    const challanId = req.params.id;

    console.log("hiii")

    // Edge case: Invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(challanId)) {
      return res.status(400).json({ message: "Invalid challan ID" });
    }

    const deletedChallan = await Challan.findByIdAndDelete(challanId);

    if (!deletedChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    return res.status(200).json({ message: "Challan deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting challan:", error);
    res.status(500).json({ message: "Server error while deleting challan" });
  }
};