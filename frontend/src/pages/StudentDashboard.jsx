import React, { useState, useEffect } from "react";
import api from "../api/axios";

function StudentDashboard({ token }) {
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("listings");

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [profRes, listRes, reqRes] = await Promise.all([
        api.get("/user/profile", { headers }),
        api.get("/products/my-listings", { headers }),
        api.get("/buy-requests/incoming", { headers })
      ]);
      setProfile(profRes.data.user);
      setMyListings(listRes.data);
      setIncomingRequests(reqRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const toggleProductStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "AVAILABLE" ? "SOLD" : "AVAILABLE";
    try {
      await api.patch(
        `/products/${productId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Item status updated to ${newStatus}!`);
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!profile) {
    return <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>Loading Profile...</div>;
  }

  return (
    <div className="container">
      {/* Student Profile Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "30px", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.6rem" }}>🎓 {profile.name}</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            ✉️ {profile.email} • 📍 {profile.hostel_block || "VIT Campus"}
          </p>
          {profile.phone_number && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "2px" }}>
              📱 WhatsApp: {profile.phone_number}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <span className="tag tag-condition">Verified Student</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          className={`chip ${activeSubTab === "listings" ? "active" : ""}`}
          onClick={() => setActiveSubTab("listings")}
        >
          📦 My Listed Items ({myListings.length})
        </button>
        <button
          className={`chip ${activeSubTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveSubTab("requests")}
        >
          📩 Incoming Buy Requests ({incomingRequests.length})
        </button>
      </div>

      {/* My Listings */}
      {activeSubTab === "listings" && (
        <div>
          {myListings.length === 0 ? (
            <div style={{ padding: "40px 0", color: "var(--text-muted)" }}>You haven't listed any items for sale yet.</div>
          ) : (
            <div className="product-grid">
              {myListings.map((item) => (
                <div key={item.id} className="card">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"}
                    alt={item.title}
                    className="card-img"
                  />
                  <div className="card-body">
                    <div style={{ marginBottom: "8px" }}>
                      <span className="tag tag-category">{item.category}</span>
                      <span className={`tag ${item.status === "SOLD" ? "tag-sold" : "tag-condition"}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <div className="card-price">₹{item.price}</div>
                    <button
                      className="btn-action"
                      style={{ background: item.status === "AVAILABLE" ? "#ef4444" : "var(--success-color)" }}
                      onClick={() => toggleProductStatus(item.id, item.status)}
                    >
                      {item.status === "AVAILABLE" ? "Mark as SOLD" : "Mark as AVAILABLE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Incoming Requests */}
      {activeSubTab === "requests" && (
        <div>
          {incomingRequests.length === 0 ? (
            <div style={{ padding: "40px 0", color: "var(--text-muted)" }}>No purchase requests received from students yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {incomingRequests.map((req) => (
                <div key={req.id} className="card" style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ fontSize: "1.1rem" }}>Interest in "{req.product_title}" (₹{req.product_price})</h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "6px 0" }}>
                        Buyer: <strong>{req.buyer_name}</strong> ({req.buyer_email}) • 📍 {req.buyer_hostel || "Campus"}
                      </p>
                      {req.buyer_phone && (
                        <p style={{ color: "#38bdf8", fontSize: "0.9rem" }}>
                          📱 Contact: {req.buyer_phone}
                        </p>
                      )}
                      <div style={{ marginTop: "10px", padding: "10px", background: "#0f172a", borderRadius: "8px" }}>
                        💬 "{req.message}"
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
