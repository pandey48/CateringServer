const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");


// Create Booking
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Bookings
router.get("/", async (req, res) => {
  try {
  const bookings = await Booking.find()
  .populate("menuItems")
  .sort({ createdAt: -1 });

  
res.json(bookings);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking Deleted Successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(booking);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;