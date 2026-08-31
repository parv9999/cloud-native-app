const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone_number, hostel_block } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    const sql =
      "INSERT INTO users (name, email, password, phone_number, hostel_block) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [name, cleanEmail, hashedPassword, phone_number || null, hostel_block || null], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already registered! Please login instead." });
        }
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Registered successfully! Welcome to VIT Bhopal Marketplace ✅"
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token
    });
  });
});

