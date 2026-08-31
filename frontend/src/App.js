import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Marketplace from "./pages/Marketplace";
import SellItem from "./pages/SellItem";
import StudentDashboard from "./pages/StudentDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setActiveTab("marketplace");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setActiveTab("marketplace");
    alert("Logged out successfully");
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        token={token}
        onLogout={handleLogout}
      />

      <main>
        {activeTab === "marketplace" && (
          <Marketplace token={token} onRequireAuth={() => setActiveTab("login")} />
        )}
        {activeTab === "sell" && (
          <SellItem token={token} onSuccess={() => setActiveTab("marketplace")} />
        )}
        {activeTab === "dashboard" && <StudentDashboard token={token} />}
        {activeTab === "register" && (
          <Register onSuccess={() => setActiveTab("login")} />
        )}
        {activeTab === "login" && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </>
  );
}

export default App;
