const express = require("express");
const router = express.Router();


const Booking = require("../models/Booking");

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("menuItems");

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
          ingredient: item.name,
          quantity: (item.quantity * persons) / 100,
          unit: item.unit,
        });

      });
    });
    const mergedMaterial = {};

material.forEach((item) => {
  const key = `${item.ingredient}_${item.unit}`;

  if (mergedMaterial[key]) {
    mergedMaterial[key].quantity += Number(item.quantity);
  } else {
    mergedMaterial[key] = {
      ingredient: item.ingredient,
      quantity: Number(item.quantity),
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
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;