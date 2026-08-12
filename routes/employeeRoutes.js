const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");

// ===============================
// CREATE EMPLOYEE
// POST /api/employees
// ===============================

router.post("/", async (req, res) => {
  try {
    console.log("========== EMPLOYEE CREATE ==========");
    console.log("Request Body:", req.body);

    const employee = await Employee.create({
      name: req.body.name,
      phone: req.body.phone,
      role: req.body.role,
      address: req.body.address || "",
      dailyRate: Number(req.body.dailyRate) || 0,
      status: req.body.status || "Active",
    });

    console.log("Employee Created:", employee);

    res.status(201).json(employee);

  } catch (error) {
    console.error("========== EMPLOYEE CREATE ERROR ==========");
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// GET ALL EMPLOYEES
// GET /api/employees
// ===============================

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({
      createdAt: -1,
    });

    res.json(employees);
  } catch (error) {
    console.error("Employee Fetch Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// GET SINGLE EMPLOYEE
// GET /api/employees/:id
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// UPDATE EMPLOYEE
// PUT /api/employees/:id
// ===============================

router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        role: req.body.role,
        address: req.body.address || "",
        dailyRate: Number(req.body.dailyRate) || 0,
        status: req.body.status || "Active",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (error) {
    console.error("Employee Update Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// DELETE EMPLOYEE
// DELETE /api/employees/:id
// ===============================

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Employee Delete Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;