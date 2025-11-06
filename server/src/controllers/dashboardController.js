const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

exports.getClerkDashboardStats = async (req, res) => {
  try {
    const [totalSales, totalRevenue, vehicles, customers] = await Promise.all([
      Sale.countDocuments(),
      Sale.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Vehicle.find(),
      Customer.countDocuments(),
    ]);

    const totalRevenueValue = totalRevenue.length ? totalRevenue[0].total : 0;

    res.json({
      totalSales,
      totalRevenue: totalRevenueValue,
      totalVehicles: vehicles.length,
      totalCustomers: customers,
    });
  } catch (err) {
    console.error("❌ Dashboard data error:", err.message);
    res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
};
