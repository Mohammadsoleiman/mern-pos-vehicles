const jwt = require("jsonwebtoken");

const auth = (allowedRoles) => (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
