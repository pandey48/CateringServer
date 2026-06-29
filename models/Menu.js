const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
});

const menuSchema = new mongoose.Schema(
  {
    dishName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ingredients: [ingredientSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);