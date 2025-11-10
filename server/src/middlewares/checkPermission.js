const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      // 1️⃣ تحقق من وجود الـ token
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      // 2️⃣ فك التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 3️⃣ جب اليوزر من الداتابيس مع دوره وصلاحياته
      const user = await User.findById(decoded.id).populate({
        path: "role",
        populate: { path: "permissions" },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      // 4️⃣ استخرج صلاحياته كأسماء string
      const userPerms = user.role.permissions.map((p) => p.name);

      // 5️⃣ تحقق إن كان عنده الصلاحية المطلوبة
      if (!userPerms.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden: missing permission" });
      }

      next(); // ✅ السماح بالمرور
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
  };
};
