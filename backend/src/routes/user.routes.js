const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const db = require("../config/db");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  const sql = "SELECT id, name, email, phone_number, hostel_block, created_at FROM users WHERE id = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json({
      user: results[0]
    });
  });
});

module.exports = router;

