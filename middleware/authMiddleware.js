const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "No token, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded.user;

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Token is not valid",
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      msg: "Admin access required",
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};