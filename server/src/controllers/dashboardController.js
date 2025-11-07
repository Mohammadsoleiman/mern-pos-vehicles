// server/src/controllers/dashboardController.js
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

exports.getDashboard = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSales = await Sale.countDocuments();

    const revenueAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

    const monthlySalesRaw = await Sale.aggregate([
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlySales = monthlySalesRaw.map((item) => ({
      month: item._id,
      sales: item.total,
    }));

    const vehicleTypes = await Vehicle.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    const recentPurchases = await Sale.find()
      .populate("customerId", "name")
      .populate("vehicleId", "make")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Sale.find()
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalVehicles,
      totalSales,
      totalRevenue,
      totalCustomers,
      monthlySales,
      vehicleTypes,
      recentPurchases,
      recentPayments,
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
