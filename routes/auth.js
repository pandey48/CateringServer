const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ==========================
// ADMIN LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login ID:", email);

    // Check ID and password from .env
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(400).json({
        msg: "Invalid Admin ID or Password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        user: {
          id: "admin",
          role: "admin",
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: "admin",
        name: "Pandey Catering Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

module.exports = router;