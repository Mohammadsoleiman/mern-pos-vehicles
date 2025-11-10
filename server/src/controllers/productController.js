exports.createProduct = async (req, res) => {
  res.json({ message: "✅ Product created successfully!" });
};

exports.getProducts = async (req, res) => {
  res.json([{ name: "Car Engine" }, { name: "Brake Pad" }]);
};
