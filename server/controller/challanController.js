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
