// server/src/controllers/salesController.js
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

/* ==========================================================
   📦 GET ALL SALES
   ========================================================== */
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customerId", "name email phone")
      .populate("vehicleId", "make model year price")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    console.error("❌ Error fetching sales:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

/* ==========================================================
   ➕ ADD NEW SALE
   ========================================================== */
exports.addSale = async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      quantity = 1,
      unitPrice,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!customerId || !vehicleId || !unitPrice || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate invoice number dynamically
    const count = await Sale.countDocuments();
    const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

    // Create and save sale
    const sale = new Sale({
      customerId,
      vehicleId,
      quantity,
      unitPrice,
      totalAmount,
      paymentMethod,
      invoiceNumber,
      status: "completed",
    });

    const savedSale = await sale.save();

    // Update customer totals
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.totalSpent = (customer.totalSpent || 0) + totalAmount;
      customer.purchaseCount = (customer.purchaseCount || 0) + 1;
      await customer.save();
    }

    // Reduce vehicle stock
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle && typeof vehicle.stock === "number") {
      vehicle.stock = Math.max(vehicle.stock - quantity, 0);
      await vehicle.save();
    }

    // Return populated sale
    const populatedSale = await Sale.findById(savedSale._id)
      .populate("customerId", "name email phone")
      .populate("vehicleId", "make model year price");

    res.status(201).json(populatedSale);
  } catch (error) {
    console.error("❌ Error adding sale:", error);
    res.status(500).json({ message: "Failed to add sale" });
  }
};

/* ==========================================================
   ✏️ UPDATE SALE
   ========================================================== */
exports.updateSale = async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("customerId", "name email phone")
      .populate("vehicleId", "make model year price");

    if (!updatedSale)
      return res.status(404).json({ message: "Sale not found" });

    res.json(updatedSale);
  } catch (error) {
    console.error("❌ Error updating sale:", error);
    res.status(500).json({ message: "Failed to update sale" });
  }
};

/* ==========================================================
   🗑️ DELETE SALE
   ========================================================== */
exports.deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale)
      return res.status(404).json({ message: "Sale not found" });

    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting sale:", error);
    res.status(500).json({ message: "Failed to delete sale" });
  }
};

/* ==========================================================
   🔍 GET SALE BY ID
   ========================================================== */
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customerId", "name email phone")
      .populate("vehicleId", "make model year price");

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    res.json(sale);
  } catch (error) {
    console.error("❌ Error getting sale:", error);
    res.status(500).json({ message: "Failed to get sale" });
  }
};
