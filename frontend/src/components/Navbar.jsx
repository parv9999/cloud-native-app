import React from "react";

function Navbar({ activeTab, setActiveTab, token, onLogout, user }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActiveTab("marketplace")} style={{ cursor: "pointer" }}>
        🎓 VIT Bhopal Campus Marketplace
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${activeTab === "marketplace" ? "active" : ""}`}
          onClick={() => setActiveTab("marketplace")}
        >
          🛒 Browse Items
        </button>

        {token ? (
          <>
            <button
              className={`nav-btn ${activeTab === "sell" ? "active" : ""}`}
              onClick={() => setActiveTab("sell")}
            >
              ➕ Sell Item
            </button>
            <button
              className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              👤 My Dashboard
            </button>
            <button className="nav-btn" onClick={onLogout} style={{ borderColor: "#ef4444", color: "#f87171" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`nav-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
              style={{ background: "var(--accent-primary)", border: "none" }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
