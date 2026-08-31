import React, { useState, useEffect } from "react";
import api from "../api/axios";

const CATEGORIES = ["All", "Cycles", "Books & Copies", "Shoes", "Clothing", "Electronics", "Hostel Essentials"];

function Marketplace({ token, onRequireAuth }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?category=${category}&search=${search}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const handleOpenBuyModal = (product) => {
    if (!token) {
      alert("Please log in to send a buy request to this seller!");
      onRequireAuth();
      return;
    }
    setSelectedProduct(product);
  };

  const handleSendBuyRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/buy-requests",
        {
          product_id: selectedProduct.id,
          seller_id: selectedProduct.seller_id,
          message: requestMessage,
          buyer_phone: buyerPhone
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert("Buy request sent to seller successfully! 📩");
      setSelectedProduct(null);
      setRequestMessage("");
      setBuyerPhone("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", margin: "20px 0 30px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700", marginBottom: "8px" }}>
          🛒 VIT Bhopal Student Marketplace
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Buy and sell campus items directly with fellow VIT Bhopal students.
        </p>
      </div>

      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search cycles, books, shoes, clothes, electronics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <h3>No items listed under this category yet!</h3>
          <p style={{ marginTop: "8px" }}>Be the first student to list something for sale.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="card">
              <img
                src={item.image_url || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"}
                alt={item.title}
                className="card-img"
              />
              <div className="card-body">
                <div style={{ marginBottom: "8px" }}>
                  <span className="tag tag-category">{item.category}</span>
                  <span className="tag tag-condition">{item.item_condition}</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <div className="card-price">₹{item.price}</div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", flexGrow: 1 }}>
                  {item.description}
                </p>
                <div className="card-seller">
                  👤 <strong>{item.seller_name}</strong> • {item.seller_hostel || "VIT Campus"}
                </div>
                <button className="btn-action" onClick={() => handleOpenBuyModal(item)}>
                  📩 Send Buy Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Request Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: "12px" }}>Send Buy Request for "{selectedProduct.title}"</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Seller: <strong>{selectedProduct.seller_name}</strong> (Price: ₹{selectedProduct.price})
            </p>

            <form onSubmit={handleSendBuyRequest}>
              <textarea
                className="input-field"
                placeholder="Message to seller (e.g. Is this cycle available? Can we meet at Block B?)"
                rows="3"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                required
              />
              <input
                type="text"
                className="input-field"
                placeholder="Your WhatsApp / Contact Number"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-action" style={{ flex: 1 }}>
                  Submit Request
                </button>
                <button
                  type="button"
                  className="nav-btn"
                  onClick={() => setSelectedProduct(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
