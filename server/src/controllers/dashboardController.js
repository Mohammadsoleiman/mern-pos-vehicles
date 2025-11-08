// server/src/controllers/dashboardController.js
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalVehicles,
      totalCustomers,
      totalSales,
      revenueAgg,
      monthlySalesRaw,
      vehicleTypes,
      recentPurchases,
      recentPayments
    ] = await Promise.all([

      Vehicle.countDocuments().lean(), // 🚀 أسرع
      Customer.countDocuments().lean(),
      Sale.countDocuments().lean(),

      Sale.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),

      Sale.aggregate([
        {
          $group: {
            _id: { $substr: ["$date", 0, 7] },
            total: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      Vehicle.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
      ]),

      Sale.find()
        .populate("customerId", "name")
        .populate("vehicleId", "make")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(), // 🚀 أسرع

      Sale.find()
        .populate("customerId", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(), // 🚀 أسرع
    ]);

    const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

    const monthlySales = monthlySalesRaw.map((item) => ({
      month: item._id,
      sales: item.total,
    }));

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