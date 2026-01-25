const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const admin = (req, res, next) => {
  console.log("Current User Data:", req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, admin };