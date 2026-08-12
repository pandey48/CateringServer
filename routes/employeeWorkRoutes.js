const express = require("express");
const router = express.Router();

const EmployeeWork = require("../models/employeeWork");
const Employee = require("../models/employee");

console.log("✅ employeeWorkRoutes.js loaded");

// ==========================================
// TEST ROUTE
// ==========================================

router.post("/test", (req, res) => {
  console.log("✅ Employee Work Test API HIT");

  res.json({
    success: true,
    message: "Employee Work Route Working",
  });
});

// ==========================================
// GET TODAY'S ATTENDANCE
// ==========================================

router.get("/today", async (req, res) => {
  try {
    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const employees = await Employee.find({
      status: "Active",
    }).sort({ name: 1 });

    const works = await EmployeeWork.find({
      workDate: {
        $gte: start,
        $lte: end,
      },
    }).populate("employee");

    const result = employees.map((employee) => {
      const work = works.find(
        (item) =>
          item.employee &&
          item.employee._id.toString() ===
            employee._id.toString()
      );

      return {
        employee,
        work: work || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("❌ Today Attendance Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// ADD / UPDATE TODAY ATTENDANCE
// ==========================================

router.post("/attendance", async (req, res) => {
  try {
    console.log("🔥 Attendance Request:", req.body);

    const {
      employee,
      attendance,
      role,
      amount,
      note,
    } = req.body;

    if (!employee) {
      return res.status(400).json({
        message: "Employee is required",
      });
    }

    if (!attendance) {
      return res.status(400).json({
        message: "Attendance is required",
      });
    }

    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    let finalAmount = Number(amount) || 0;

    // Absent = ₹0
    if (attendance === "Absent") {
      finalAmount = 0;
    }

    // Half Day = 50%
    if (attendance === "Half Day") {
      finalAmount = finalAmount / 2;
    }

    // Check today's existing record
    let work = await EmployeeWork.findOne({
      employee,
      workDate: {
        $gte: start,
        $lte: end,
      },
    });

    // Update existing record
    if (work) {
      work.attendance = attendance;
      work.role = role || work.role;
      work.amount = finalAmount;
      work.note = note || "";

      await work.save();

      console.log("✅ Attendance Updated");
    }

    // Create new record
    else {
      work = await EmployeeWork.create({
        employee,
        workDate: today,
        attendance,
        role: role || "",
        amount: finalAmount,
        paymentStatus: "Pending",
        paymentDate: null,
        note: note || "",
      });

      console.log("✅ Attendance Created");
    }

    const result = await EmployeeWork.findById(
      work._id
    ).populate("employee");

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ Attendance Save Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// MARK PAYMENT AS PAID
// ==========================================

router.put("/:id/payment", async (req, res) => {
  try {
    const work = await EmployeeWork.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "Paid",
        paymentDate: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee");

    if (!work) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.json(work);
  } catch (error) {
    console.error("❌ Payment Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET ALL WORK HISTORY
// ==========================================

router.get("/", async (req, res) => {
  try {
    const works = await EmployeeWork.find()
      .populate("employee")
      .populate("booking")
      .sort({
        workDate: -1,
      });

    res.json(works);
  } catch (error) {
    console.error("❌ Work History Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET PARTICULAR EMPLOYEE HISTORY
// ==========================================

router.get("/employee/:employeeId", async (req, res) => {
  try {
    const works = await EmployeeWork.find({
      employee: req.params.employeeId,
    })
      .populate("employee")
      .populate("booking")
      .sort({
        workDate: -1,
      });

    res.json(works);
  } catch (error) {
    console.error("❌ Employee History Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE WORK RECORD
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const work = await EmployeeWork.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("employee");

    if (!work) {
      return res.status(404).json({
        message: "Work record not found",
      });
    }

    res.json(work);
  } catch (error) {
    console.error("❌ Work Update Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// DELETE WORK RECORD
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const work = await EmployeeWork.findByIdAndDelete(
      req.params.id
    );

    if (!work) {
      return res.status(404).json({
        message: "Work record not found",
      });
    }

    res.json({
      message: "Work record deleted successfully",
    });
  } catch (error) {
    console.error("❌ Work Delete Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;