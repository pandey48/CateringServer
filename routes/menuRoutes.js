const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

// Add Menu
router.post("/", async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Menu
router.put("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Menu
router.delete("/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", async (req, res) => {
  res.json({ message: "Menu API Working" });
});
module.exports = router;