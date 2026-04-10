import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email is required.");
    if (!form.password) return setError("Password is required.");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to AuthSystem"
      subtitle="Don't have an account?"
      linkText="Sign up now"
      linkTo="/register"
    >
      <form onSubmit={handleSubmit} id="login-form">
        {error && (
          <div className="alert alert-error" id="login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Email */}
        <div className="input-group">
          <label className="input-label" htmlFor="login-email">Email Address</label>
          <div className="input-wrapper">
            <input
              id="login-email"
              type="email"
              name="email"
              className="input-field"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label className="input-label" htmlFor="login-password">Password</label>
          <div className="input-wrapper">
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              name="password"
              className="input-field"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <span
              className="input-icon"
              onClick={() => setShowPass(!showPass)}
              title={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="form-row">
          <label className="checkbox-label" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-link" id="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
