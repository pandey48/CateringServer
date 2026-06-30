const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// Get Material by Booking ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("menuItems");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const persons = booking.persons;
    const material = [];

    booking.menuItems.forEach((menu) => {
      menu.ingredients.forEach((item) => {
        material.push({
          dish: menu.dishName,
          category: item.category,
          ingredient: item.name,
          quantity: (Number(item.quantity) * persons) / 100,
          unit: item.unit,
        });
      });
    });

    // Merge same ingredients
    const mergedMaterial = {};

    material.forEach((item) => {
      const key = `${item.category}_${item.ingredient}_${item.unit}`;

      if (mergedMaterial[key]) {
        mergedMaterial[key].quantity += item.quantity;
      } else {
        mergedMaterial[key] = {
          category: item.category,
          ingredient: item.ingredient,
          quantity: item.quantity,
          unit: item.unit,
        };
      }
    });

    const finalMaterial = Object.values(mergedMaterial);

    res.json({
      booking,
      material,
      summary: finalMaterial,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;