import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Password strength calculator
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: "Weak", level: "weak", count: 1 };
  if (score === 2) return { label: "Fair", level: "fair", count: 2 };
  if (score === 3) return { label: "Good", level: "good", count: 3 };
  return { label: "Strong", level: "strong", count: 4 };
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = form.password ? getStrength(form.password) : null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setSuccess(res.data.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkTo="/login"
    >
      <form onSubmit={handleSubmit} id="register-form">
        {error && (
          <div className="alert alert-error" id="register-error">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" id="register-success">
            <span>✅</span> {success}
          </div>
        )}

        {/* Name */}
        <div className="input-group">
          <label className="input-label" htmlFor="reg-name">Full Name</label>
          <div className="input-wrapper">
            <input
              id="reg-name"
              type="text"
              name="name"
              className={`input-field ${error && !form.name ? "error" : ""}`}
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="input-group">
          <label className="input-label" htmlFor="reg-email">Email Address</label>
          <div className="input-wrapper">
            <input
              id="reg-email"
              type="email"
              name="email"
              className="input-field"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label className="input-label" htmlFor="reg-password">Password</label>
          <div className="input-wrapper">
            <input
              id="reg-password"
              type={showPass ? "text" : "password"}
              name="password"
              className="input-field"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <span
              className="input-icon"
              onClick={() => setShowPass(!showPass)}
              title={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Strength meter */}
          {strength && (
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`strength-bar ${i <= strength.count ? `active ${strength.level}` : ""}`}
                  />
                ))}
              </div>
              <span className={`strength-label ${strength.level}`}>{strength.label}</span>
            </div>
          )}
        </div>

        <button
          id="register-submit"
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: "8px" }}
        >
          {loading ? <span className="spinner" /> : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
