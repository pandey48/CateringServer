const mongoose = require("mongoose");

const employeeWorkSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    workDate: {
      type: Date,
      required: true,
    },

    attendance: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      default: "Present",
    },

    role: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmployeeWork",
  employeeWorkSchema
);