const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");

// =====================================================
// GET ALL INVOICES
// =====================================================

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("booking")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    console.error("Get invoices error:", error);

    res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
});


// =====================================================
// GET SINGLE INVOICE
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("booking");

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Get invoice error:", error);

    res.status(500).json({
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
});


// =====================================================
// CREATE / GENERATE INVOICE FROM BOOKING
// =====================================================

router.post("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check booking
    const booking = await Booking.findById(bookingId)
      .populate("menuItems");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Prevent duplicate invoice
    const existingInvoice = await Invoice.findOne({
      booking: bookingId,
    });

    if (existingInvoice) {
      return res.status(400).json({
        message: "Invoice already exists for this booking",
        invoice: existingInvoice,
      });
    }

    // Get only selected menu names
    const menuItems = (booking.menuItems || []).map((menu) => {
      return menu.dishName || menu.name || "Selected Item";
    });

    // Generate invoice number
    const count = await Invoice.countDocuments();

    const invoiceNo = `INV-${String(count + 1).padStart(5, "0")}`;

    const invoice = new Invoice({
      invoiceNo,

      booking: booking._id,

      customerName: booking.customerName,

      phone: booking.phone,

      eventType: booking.eventType,

      eventDate: booking.eventDate,

      persons: booking.persons,

      address: booking.address,

      menuItems,

      totalAmount: 0,

      advanceAmount: 0,

      balanceAmount: 0,

      paymentStatus: "Pending",
    });

    await invoice.save();

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Create invoice error:", error);

    res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE PAYMENT
// =====================================================

router.put("/:id/payment", async (req, res) => {
  try {
    const { totalAmount, advanceAmount } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const total = Number(totalAmount) || 0;
    const advance = Number(advanceAmount) || 0;

    if (total < 0 || advance < 0) {
      return res.status(400).json({
        message: "Amount cannot be negative",
      });
    }

    if (advance > total) {
      return res.status(400).json({
        message: "Advance payment cannot be greater than total amount",
      });
    }

    const balance = total - advance;

    let paymentStatus = "Pending";

    if (total > 0 && advance === total) {
      paymentStatus = "Paid";
    } else if (advance > 0 && advance < total) {
      paymentStatus = "Partial";
    }

    invoice.totalAmount = total;
    invoice.advanceAmount = advance;
    invoice.balanceAmount = balance;
    invoice.paymentStatus = paymentStatus;

    await invoice.save();

    res.json(invoice);
  } catch (error) {
    console.error("Payment update error:", error);

    res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE INVOICE
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

    res.status(500).json({
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
});


module.exports = router;