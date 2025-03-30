const jwt = require("jsonwebtoken");

const  isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Move to the next middleware
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};


 const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }
  
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
  
    next();
  };
  
  module.exports = { isAuthenticated ,isAdmin};