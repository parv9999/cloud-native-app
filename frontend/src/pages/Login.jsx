import { useState } from "react";
import api from "../api/axios";

function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful ✅");
      if (onLoginSuccess) onLoginSuccess(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-box">
      <h2 style={{ marginBottom: "8px" }}>🔑 Student Login</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
        Enter your VIT Bhopal student credentials to buy and sell.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="VIT Bhopal Email (@vitbhopal.ac.in)"
          value={form.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input-field"
          required
        />

        <button type="submit" className="btn-action">
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
