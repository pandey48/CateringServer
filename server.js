const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/material", require("./routes/materialRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
