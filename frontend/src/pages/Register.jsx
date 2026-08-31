import { useState } from "react";
import api from "../api/axios";

function Register({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    hostel_block: "Block A"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim().toLowerCase().endsWith("@vitbhopal.ac.in")) {
      alert("⚠️ Registration is restricted to official VIT Bhopal email addresses ending in @vitbhopal.ac.in");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.message || "Registered successfully! ✅");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-box">
      <h2 style={{ marginBottom: "8px" }}>🎓 Student Registration</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
        Exclusive peer-to-peer marketplace for VIT Bhopal students.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          name="email"
          placeholder="College Email (e.g. name@vitbhopal.ac.in)"
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
        <input
          name="phone_number"
          placeholder="WhatsApp / Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="input-field"
        />
        <select
          name="hostel_block"
          value={form.hostel_block}
          onChange={handleChange}
          className="input-field"
        >
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
          <option value="Block D">Block D</option>
          <option value="Girls Hostel">Girls Hostel</option>
          <option value="Day Scholar">Day Scholar</option>
        </select>

        <button type="submit" className="btn-action">
          Register Student Account
        </button>
      </form>
    </div>
  );
}

export default Register;
