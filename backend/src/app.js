const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
require("./config/db");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

// base test
app.get("/", (req, res) => {
  res.send("Backend + MySQL working 🚀");
});

// auth routes
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/user.routes");

app.use("/api/user", userRoutes);


module.exports = app;
