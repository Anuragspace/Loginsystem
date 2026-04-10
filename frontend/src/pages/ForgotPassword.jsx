import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) return setError("Email address is required.");

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Remember your password?"
      linkText="Sign in"
      linkTo="/login"
    >
      <form onSubmit={handleSubmit} id="forgot-password-form">
        {error && (
          <div className="alert alert-error" id="forgot-error">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" id="forgot-success">
            <span>📩</span> {success}
          </div>
        )}

        {!success && (
          <>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>
              Enter the email address associated with your account and we'll send you a password reset link.
            </p>

            <div className="input-group">
              <label className="input-label" htmlFor="forgot-email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="forgot-email"
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Send Reset Link"}
            </button>
          </>
        )}

        {success && (
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Link
              to="/login"
              id="back-to-login"
              style={{ color: "var(--orange)", fontWeight: 600, fontSize: "14px" }}
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
