const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const db = require("../config/db");

const router = express.Router();

// 1. Create a new product listing (Seller)
router.post("/", authMiddleware, (req, res) => {
  const { title, description, price, category, image_url, item_condition } = req.body;
  const seller_id = req.user.id;

  if (!title || !price || !category) {
    return res.status(400).json({ message: "Title, price, and category are required" });
  }

  const sql = `
    INSERT INTO products (seller_id, title, description, price, category, image_url, item_condition)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [seller_id, title, description || "", price, category, image_url || "", item_condition || "Good"],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Item listed successfully on VIT Bhopal Marketplace! 🎉",
        productId: result.insertId
      });
    }
  );
});

// 2. Get all available products (Buyer Marketplace Browse)
router.get("/", (req, res) => {
  const { category, search } = req.query;
  let sql = `
    SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone_number as seller_phone, u.hostel_block as seller_hostel
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'AVAILABLE'
  `;
  const params = [];

  if (category && category !== "All") {
    sql += " AND p.category = ?";
    params.push(category);
  }

  if (search) {
    sql += " AND (p.title LIKE ? OR p.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY p.created_at DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 3. Get my listings (Seller Dashboard)
router.get("/my-listings", authMiddleware, (req, res) => {
  const sql = "SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 4. Update status (e.g. mark as SOLD)
router.patch("/:id/status", authMiddleware, (req, res) => {
  const { status } = req.body;
  const productId = req.params.id;

  const sql = "UPDATE products SET status = ? WHERE id = ? AND seller_id = ?";
  db.query(sql, [status, productId, req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Status updated successfully ✅" });
  });
});

module.exports = router;
