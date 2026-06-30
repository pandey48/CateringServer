const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
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

    // Ingredients Array
    ingredients: [ingredientSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", menuSchema);