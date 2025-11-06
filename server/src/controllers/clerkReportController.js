const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

exports.getClerkReportData = async (req, res) => {
  try {
    // Get all sales, customers, vehicles
    const [sales, customers, vehicles] = await Promise.all([
      Sale.find().populate("customerId vehicleId"),
      Customer.find(),
      Vehicle.find(),
    ]);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // 🧩 Top Vehicles
    const vehicleMap = {};
    sales.forEach((s) => {
      if (!s.vehicleId) return;
      const id = String(s.vehicleId._id);
      if (!vehicleMap[id]) vehicleMap[id] = { count: 0, revenue: 0, vehicle: s.vehicleId };
      vehicleMap[id].count += 1;
      vehicleMap[id].revenue += s.totalAmount || 0;
    });
    const topVehicles = Object.values(vehicleMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 🧩 Top Customers
    const customerMap = {};
    sales.forEach((s) => {
      if (!s.customerId) return;
      const id = String(s.customerId._id);
      if (!customerMap[id]) customerMap[id] = { count: 0, totalSpent: 0, customer: s.customerId };
      customerMap[id].count += 1;
      customerMap[id].totalSpent += s.totalAmount || 0;
    });
    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // 🧩 Recent Transactions
    const recentTransactions = sales
      .slice(-10)
      .reverse()
      .map((s) => ({
        invoiceNumber: s.invoiceNumber,
        customer: s.customerId?.name,
        vehicle: s.vehicleId ? `${s.vehicleId.make} ${s.vehicleId.model}` : "N/A",
        totalAmount: s.totalAmount,
        paymentMethod: s.paymentMethod,
        date: s.createdAt,
        status: s.status,
      }));

    res.json({
      totalSales,
      totalRevenue,
      averageSale,
      totalCustomers: customers.length,
      totalVehicles: vehicles.length,
      topVehicles,
      topCustomers,
      recentTransactions,
    });
  } catch (err) {
    console.error("❌ Clerk report fetch error:", err);
    res.status(500).json({ message: "Failed to fetch clerk report data." });
  }
};
