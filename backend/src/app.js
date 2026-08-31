const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// base test
app.get("/", (req, res) => {
  res.send("VIT Bhopal Campus Marketplace API 🚀");
});

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/buy-requests", requestRoutes);

module.exports = app;


