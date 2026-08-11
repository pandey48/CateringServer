const express = require("express");
const router = express.Router();

const EmployeeWork = require("../models/Employee");

// Add work
router.post("/", async (req, res) => {
  try {
    const work = await EmployeeWork.create(req.body);

    res.status(201).json(work);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Get all work
router.get("/", async (req, res) => {
  try {
    const works = await EmployeeWork.find()
      .populate("employee")
      .populate("booking")
      .sort({ workDate: -1 });

    res.json(works);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Get employee work history
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const works = await EmployeeWork.find({
      employee: req.params.employeeId,
    })
      .populate("booking")
      .sort({ workDate: -1 });

    res.json(works);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Update work/payment
router.put("/:id", async (req, res) => {
  try {
    const work = await EmployeeWork.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!work) {
      return res.status(404).json({
        message: "Work record not found",
      });
    }

    res.json(work);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Delete work
router.delete("/:id", async (req, res) => {
  try {
    await EmployeeWork.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Work record deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;