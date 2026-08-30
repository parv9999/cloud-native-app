const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

// base test
app.get("/", (req, res) => {
  res.send("Backend + MySQL working 🚀");
});

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

module.exports = app;

