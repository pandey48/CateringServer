const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      unique: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    customerName: String,

    phone: String,

    eventDate: Date,

    eventType: String,

    persons: Number,

    totalAmount: Number,

    advanceAmount: {
      type: Number,
      default: 0,
    },

    balanceAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);