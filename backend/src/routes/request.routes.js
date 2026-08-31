const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const db = require("../config/db");

const router = express.Router();

// 1. Submit a buy request (Buyer)
router.post("/", authMiddleware, (req, res) => {
  const { product_id, seller_id, message, buyer_phone } = req.body;
  const buyer_id = req.user.id;

  if (buyer_id === Number(seller_id)) {
    return res.status(400).json({ message: "You cannot send a buy request for your own product!" });
  }

  const sql = `
    INSERT INTO buy_requests (product_id, buyer_id, seller_id, message, buyer_phone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [product_id, buyer_id, seller_id, message || "", buyer_phone || ""], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Buy request sent to seller successfully! 📩" });
  });
});

// 2. Get incoming buy requests for seller
router.get("/incoming", authMiddleware, (req, res) => {
  const sql = `
    SELECT br.*, p.title as product_title, p.price as product_price, p.image_url, u.name as buyer_name, u.email as buyer_email, u.hostel_block as buyer_hostel
    FROM buy_requests br
    JOIN products p ON br.product_id = p.id
    JOIN users u ON br.buyer_id = u.id
    WHERE br.seller_id = ?
    ORDER BY br.created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 3. Get sent buy requests by buyer
router.get("/sent", authMiddleware, (req, res) => {
  const sql = `
    SELECT br.*, p.title as product_title, p.price as product_price, p.image_url, u.name as seller_name, u.email as seller_email, u.phone_number as seller_phone
    FROM buy_requests br
    JOIN products p ON br.product_id = p.id
    JOIN users u ON br.seller_id = u.id
    WHERE br.buyer_id = ?
    ORDER BY br.created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
