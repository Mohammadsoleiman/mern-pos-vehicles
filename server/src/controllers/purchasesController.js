const Purchase = require("../models/Purchase");

// 🧮 Helper to get current month name + year
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
};

// 👀 Get all purchases (temporary: show ALL until migration)
exports.getPurchases = async (req, res) => {
  try {
    // 🔹 Show all data — old & new
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add new purchase (auto month/date)
exports.addPurchase = async (req, res) => {
  try {
    const currentMonth = getCurrentMonth();
    const purchase = new Purchase({
      ...req.body,
      month: currentMonth,
      date: new Date().toISOString().split("T")[0], // 📅 YYYY-MM-DD
    });
    await purchase.save();
    res.json(purchase);
  } catch (err) {
    console.error("❌ Error adding purchase:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Purchase not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating purchase:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Purchase not found" });
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting purchase:", err);
    res.status(500).json({ error: err.message });
  }
};
