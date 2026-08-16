const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      unique: true,
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
    },

    eventDate: {
      type: Date,
    },

    persons: {
      type: Number,
    },

    address: {
      type: String,
    },

    // Only selected menu names
    menuItems: [
      {
        type: String,
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    advanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);