const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");

router.post("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("menuItems");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    let totalAmount = 0;

    booking.menuItems.forEach((item) => {
      totalAmount += item.price * booking.persons;
    });

    const invoice = await Invoice.create({
      invoiceNo: "INV-" + Date.now(),
      booking: booking._id,
      customerName: booking.customerName,
      phone: booking.phone,
      eventDate: booking.eventDate,
      eventType: booking.eventType,
      persons: booking.persons,
      totalAmount,
      advanceAmount: 0,
      balanceAmount: totalAmount,
    });

    res.status(201).json(invoice);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  const invoices = await Invoice.find().sort({
    createdAt: -1,
  });

  res.json(invoices);
});

module.exports = router;