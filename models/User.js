const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    Vilage: String,
    phone: String,
    EventDate:Number,
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);