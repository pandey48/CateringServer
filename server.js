const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://catering-project-six.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
  const authRoutes = require("./routes/auth");
  const invoiceRoutes = require("./routes/invoiceRoutes");

app.use("/api/auth", authRoutes);

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/material", require("./routes/materialRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/invoices", invoiceRoutes);


// Test API
app.use(
  "/api/employees",
  require("./routes/employeeRoutes")
);
app.use(
  "/api/employee-work",
  require("./routes/employeeWorkRoutes")
);
app.get("/", (req, res) => {
  res.json({
    message: "Catering API is running",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});