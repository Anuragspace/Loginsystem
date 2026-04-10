import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axios";

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = password ? getStrength(password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Remember your password?"
      linkText="Sign in"
      linkTo="/login"
    >
      <form onSubmit={handleSubmit} id="reset-password-form">
        {error && (
          <div className="alert alert-error" id="reset-error">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" id="reset-success">
            <span>✅</span> {success} Redirecting to login...
          </div>
        )}

        {!success && (
          <>
            <div className="input-group">
              <label className="input-label" htmlFor="reset-password">New Password</label>
              <div className="input-wrapper">
                <input
                  id="reset-password"
                  type={showPass ? "text" : "password"}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoFocus
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </span>
              </div>

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

            <div className="input-group">
              <label className="input-label" htmlFor="reset-confirm">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="reset-confirm"
                  type={showPass ? "text" : "password"}
                  className={`input-field ${confirm && password !== confirm ? "error" : ""}`}
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                />
              </div>
              {confirm && password !== confirm && (
                <span className="input-error">Passwords do not match</span>
              )}
            </div>

            <button
              id="reset-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
