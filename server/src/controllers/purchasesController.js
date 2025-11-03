const Purchase = require("../models/Purchase");

// 👀 Get all purchases
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add purchase
exports.addPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
