const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    phone: String,
    eventDate: Date,
    eventType: String,
    persons: Number,
    address: String,

    // Selected Dishes
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);