import { Challan } from "../model/challanModel.js"; // adjust path as needed

export const createChallan = async (req, res) => {
  try {
    const {
      customer,
      challanNumber,
      date,
      items,
      gstPercentage = 0
    } = req.body;

    const user = req.id; // 👈 user from auth middleware (e.g., token)

    if (!customer || !challanNumber || !items || items.length === 0) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // 🔁 Calculate item totals
    const calculatedItems = items.map(item => {
      const total = item.quantity * item.rate;
      return { ...item, total };
    });

    // ➕ Calculate subTotal
    const subTotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);

    // 🧾 Calculate GST and Grand Total
    const gstAmount = (subTotal * gstPercentage) / 100;
    const grandTotal = subTotal + gstAmount;

    // ✅ Create and save Challan
    const newChallan = await Challan.create({
      user,
      customer,
      challanNumber,
      date: date || new Date(),
      items: calculatedItems,
      subTotal,
      gstPercentage,
      gstAmount,
      grandTotal
    });

    return res.status(201).json({
      success: true,
      message: "Challan created successfully",
      challan: newChallan
    });

  } catch (error) {
    console.error("Create Challan Error:", error);
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
    const challans = await Challan.find({ user: req.id }).sort({ createdAt: -1 }).populate('customer');
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
    const challan = await Challan.findById(id).populate('customer').populate("user", "name email");
    
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

    return res.status(200).json({ message: "Challan deleted successfully" });
  } catch (error) {
    console.error("Error deleting challan:", error);
    res.status(500).json({ message: "Server error while deleting challan" });
  }
};