import React, { useState } from "react";
import api from "../api/axios";

const CATEGORIES = ["Cycles", "Books & Copies", "Shoes", "Clothing", "Electronics", "Hostel Essentials"];

function SellItem({ token, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "Cycles",
    item_condition: "Good",
    description: "",
    image_url: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🎉 Your item has been listed live on the VIT Bhopal Marketplace!");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to list item");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="auth-box" style={{ maxWidth: "100%", margin: "20px 0" }}>
        <h2 style={{ marginBottom: "8px" }}>📢 List an Item for Sale</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
          Post your used cycle, books, shoes, or hostel gear for other VIT Bhopal students.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
            Item Title *
          </label>
          <input
            name="title"
            placeholder="e.g. Hero Sprint Cycle 21-Speed / Digital Logic Book"
            value={form.title}
            onChange={handleChange}
            className="input-field"
            required
          />

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                Price (₹) *
              </label>
              <input
                name="price"
                type="number"
                placeholder="Price in ₹"
                value={form.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                Category *
              </label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                Condition
              </label>
              <select name="item_condition" value={form.item_condition} onChange={handleChange} className="input-field">
                <option value="Like New">Like New ✨</option>
                <option value="Good">Good 👍</option>
                <option value="Fair">Fair 👌</option>
              </select>
            </div>
          </div>

          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
            Photo Image URL (Optional or Unsplash URL)
          </label>
          <input
            name="image_url"
            placeholder="e.g. https://images.unsplash.com/... or paste image URL"
            value={form.image_url}
            onChange={handleChange}
            className="input-field"
          />

          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
            Item Description
          </label>
          <textarea
            name="description"
            rows="3"
            placeholder="Describe the condition, usage, reason for selling..."
            value={form.description}
            onChange={handleChange}
            className="input-field"
          />

          <button type="submit" className="btn-action">
            🚀 Publish Listing Live
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellItem;
