const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    res.json({
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;