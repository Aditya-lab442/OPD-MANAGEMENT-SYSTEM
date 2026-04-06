const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication", success: false });
  }

  try {
    const splitToken = token.split(" ")[1] || token;
    const decoded = jwt.verify(splitToken, process.env.JWT_SECRET || "SECRET_KEY");
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
  return next();
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: You do not have permission to access this resource", success: false });
    }
    next();
  }
}

module.exports = { verifyToken, verifyRole };
